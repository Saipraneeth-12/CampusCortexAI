"""
video_generator.py — Morning Pulse AI CEO Briefing Video
Layout:
  - Dark gradient background
  - Avatar image (avatar.avif) on the right side
  - Animated subtitle text at the bottom (synced to TTS)
  - Branding / header at the top
  - gTTS English narration merged via moviepy
"""
import os
import math
import tempfile
import shutil
from pathlib import Path
from datetime import datetime

import numpy as np
from PIL import Image, ImageDraw, ImageFont

# ── Constants ─────────────────────────────────────────────────────────────────
VIDEO_OUTPUT_DIR = Path(__file__).parent / "generated_videos"
VIDEO_OUTPUT_DIR.mkdir(exist_ok=True)

AVATAR_PATH = Path(__file__).parent / "avatar.avif"

WIDTH, HEIGHT = 960, 540   # 16:9, compact size
FPS = 15

ROLE_COLORS = {
    "Institute Owner":      ((100, 160, 255), (255, 100, 160)),
    "Backend Developer":    ((100, 255, 180), (255, 200, 80)),
    "Data Engineer":        ((180, 100, 255), (80, 220, 255)),
    "Founder / Entrepreneur": ((255, 160, 80), (255, 80, 120)),
    "Product Builder":      ((80, 220, 255),  (160, 100, 255)),
}

ROLE_BRIEFING_FOCUS = {
    "Institute Owner": {
        "focus": "student growth, admissions, automation, institute competition, revenue opportunities",
        "tone": "Strategic, growth-focused",
    },
    "Backend Developer": {
        "focus": "rising backend tools, career growth, hiring signals, architecture trends",
        "tone": "Technical, forward-thinking",
    },
    "Data Engineer": {
        "focus": "pipelines, cloud trends, AI data infrastructure, real-time analytics",
        "tone": "Data-driven, analytical",
    },
    "Founder / Entrepreneur": {
        "focus": "startup opportunities, funding signals, product gaps, monetization",
        "tone": "Entrepreneurial, opportunity-focused",
    },
    "Product Builder": {
        "focus": "product launches, UX trends, feature opportunities, user engagement",
        "tone": "Creative, user-centric",
    },
}


# ── Font helpers ──────────────────────────────────────────────────────────────

def _font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont:
    candidates = [
        f"C:/Windows/Fonts/{'arialbd' if bold else 'arial'}.ttf",
        f"C:/Windows/Fonts/{'calibrib' if bold else 'calibri'}.ttf",
        "C:/Windows/Fonts/segoeui.ttf",
        "C:/Windows/Fonts/tahoma.ttf",
    ]
    for p in candidates:
        try:
            return ImageFont.truetype(p, size)
        except Exception:
            continue
    return ImageFont.load_default()


def _wrap(draw: ImageDraw.Draw, text: str, font, max_w: int) -> list[str]:
    words = text.split()
    lines, cur = [], []
    for w in words:
        test = " ".join(cur + [w])
        if draw.textbbox((0, 0), test, font=font)[2] > max_w and cur:
            lines.append(" ".join(cur))
            cur = [w]
        else:
            cur.append(w)
    if cur:
        lines.append(" ".join(cur))
    return lines


# ── Avatar loader ─────────────────────────────────────────────────────────────

def _load_avatar(target_h: int) -> Image.Image | None:
    """Load avatar.avif, resize to target height, return RGBA."""
    try:
        import pillow_avif  # register AVIF support
        img = Image.open(AVATAR_PATH).convert("RGBA")
        w, h = img.size
        new_w = int(w * target_h / h)
        return img.resize((new_w, target_h), Image.LANCZOS)
    except Exception as e:
        print(f"[video_generator] Avatar load failed: {e}")
        return None


# ── Script generation ─────────────────────────────────────────────────────────

def generate_briefing_script(role: str, report_data: dict) -> str:
    from groq_processor import _try_all_models

    info = ROLE_BRIEFING_FOCUS.get(role, ROLE_BRIEFING_FOCUS["Institute Owner"])
    daily_brief  = report_data.get("daily_brief", "")
    top_trends   = report_data.get("top_trends", [])[:3]
    opportunities = report_data.get("growth_opportunities", [])[:2]
    threats      = report_data.get("threats", [])[:1]

    prompt = f"""You are a professional CEO briefing an executive. Generate a CONCISE 45-second briefing script for a {role}.

TONE: {info['tone']}
FOCUS: {info['focus']}

TODAY'S REPORT:
{daily_brief}

TOP TRENDS: {', '.join(top_trends)}
OPPORTUNITIES: {', '.join(opportunities)}
THREATS: {', '.join(threats)}

REQUIREMENTS:
1. Start: "Good morning. Today's Morning Pulse briefing for {role}."
2. 2-3 key insights from the report
3. 1 actionable opportunity
4. End: "Stay ahead. Stay informed. Morning Pulse AI."
5. ~100 words total, short punchy sentences
6. Natural spoken English, no bullet points

Return ONLY the script text."""

    try:
        return _try_all_models(prompt).strip()
    except Exception as e:
        print(f"[video_generator] Script generation failed: {e}")
        return (
            f"Good morning. Today's Morning Pulse briefing for {role}. "
            f"We're seeing significant acceleration in AI adoption across the market. "
            f"Key opportunities are emerging in {info['focus'].split(',')[0]}. "
            "Three critical trends to watch: market consolidation is accelerating, "
            "AI integration is becoming table stakes, and new tools are reshaping the landscape. "
            "Your action: review your current strategy against these market shifts. "
            "Stay ahead. Stay informed. Morning Pulse AI."
        )


# ── Subtitle chunker ──────────────────────────────────────────────────────────

def _chunk_script(script: str, total_frames: int) -> list[tuple[int, int, str]]:
    """
    Split script into subtitle chunks.
    Returns list of (start_frame, end_frame, text).
    """
    # Split into sentences
    import re
    sentences = [s.strip() for s in re.split(r'(?<=[.!?])\s+', script) if s.strip()]
    if not sentences:
        return [(0, total_frames, script)]

    frames_per_sentence = total_frames // len(sentences)
    chunks = []
    for i, sent in enumerate(sentences):
        start = i * frames_per_sentence
        end   = start + frames_per_sentence if i < len(sentences) - 1 else total_frames
        chunks.append((start, end, sent))
    return chunks


# ── Frame renderer ────────────────────────────────────────────────────────────

def _render_frame(
    frame_idx: int,
    total_frames: int,
    subtitle: str,
    role: str,
    color: tuple,
    accent: tuple,
    avatar: Image.Image | None,
    scene: str,          # "intro" | "main" | "outro"
    scene_progress: float,
) -> np.ndarray:
    """Render a single 960×540 frame."""

    img = Image.new("RGB", (WIDTH, HEIGHT), (10, 10, 28))
    draw = ImageDraw.Draw(img)

    # ── Background gradient ──
    for y in range(HEIGHT):
        t = y / HEIGHT
        r = int(10 + t * 20)
        g = int(10 + t * 15)
        b = int(28 + t * 30)
        draw.line([(0, y), (WIDTH, y)], fill=(r, g, b))

    # ── Subtle animated particles ──
    rng = np.random.default_rng(42)
    px = rng.integers(0, WIDTH, 20)
    py = rng.integers(0, HEIGHT, 20)
    for i in range(20):
        y = int((py[i] + frame_idx * 0.4) % HEIGHT)
        a = int(40 + 20 * math.sin(frame_idx * 0.05 + i))
        c = tuple(min(255, int(v * a / 255)) for v in color)
        draw.ellipse([px[i]-2, y-2, px[i]+2, y+2], fill=c)

    # ── Header bar ──
    draw.rectangle([0, 0, WIDTH, 52], fill=(14, 14, 38))
    draw.rectangle([0, 50, WIDTH, 53], fill=color)

    f_title = _font(22, bold=True)
    f_sub   = _font(14)
    draw.text((20, 14), "Morning Pulse AI", fill=color, font=f_title)
    draw.text((WIDTH - 220, 18), f"CEO Briefing · {role}", fill=(160, 160, 200), font=f_sub)

    # ── Avatar (right side) ──
    avatar_x = WIDTH - 10
    if avatar:
        avatar_h = HEIGHT - 52 - 110   # leave room for header + subtitle bar
        av = avatar.resize(
            (int(avatar.width * avatar_h / avatar.height), avatar_h),
            Image.LANCZOS
        )
        # Fade in during intro
        if scene == "intro":
            alpha = int(255 * min(1.0, scene_progress * 2))
            av_arr = np.array(av)
            av_arr[:, :, 3] = (av_arr[:, :, 3] * alpha // 255).astype(np.uint8)
            av = Image.fromarray(av_arr)

        avatar_x = WIDTH - av.width - 10
        avatar_y = 58
        img.paste(av, (avatar_x, avatar_y), av)

    # ── Content area (left of avatar) ──
    content_w = avatar_x - 30
    if scene == "intro":
        # Big title
        f_big = _font(42, bold=True)
        f_med = _font(24)
        alpha = min(1.0, scene_progress * 1.5)
        title = "Morning Pulse AI"
        bbox = draw.textbbox((0, 0), title, font=f_big)
        tw = bbox[2] - bbox[0]
        tx = max(20, (content_w - tw) // 2)
        draw.text((tx, 130), title, fill=color, font=f_big)

        sub = f"Personalized Briefing"
        bbox2 = draw.textbbox((0, 0), sub, font=f_med)
        sw = bbox2[2] - bbox2[0]
        draw.text((max(20, (content_w - sw) // 2), 185), sub, fill=(180, 180, 220), font=f_med)

        # Animated underline
        lw = int(tw * min(1.0, scene_progress * 2))
        draw.rectangle([tx, 178, tx + lw, 181], fill=accent)

    elif scene == "outro":
        f_big = _font(48, bold=True)
        f_med = _font(28, bold=True)
        draw.text((20, 120), "Stay Ahead.", fill=color, font=f_big)
        draw.text((20, 185), "Stay Informed.", fill=accent, font=f_med)
        dw = int(300 * min(1.0, scene_progress * 2))
        draw.rectangle([20, 230, 20 + dw, 234], fill=(100, 100, 160))
        draw.text((20, 250), "Morning Pulse AI", fill=(180, 180, 220), font=_font(20))

    # ── Subtitle bar at bottom ──
    sub_h = 100
    sub_y = HEIGHT - sub_h
    draw.rectangle([0, sub_y, WIDTH, HEIGHT], fill=(8, 8, 22))
    draw.rectangle([0, sub_y, WIDTH, sub_y + 2], fill=accent)

    if subtitle:
        f_sub_text = _font(22)
        margin = 20
        lines = _wrap(draw, subtitle, f_sub_text, WIDTH - 2 * margin)
        # Show max 2 lines
        lines = lines[:2]
        total_h = len(lines) * 32
        y_start = sub_y + (sub_h - total_h) // 2
        for line in lines:
            bbox = draw.textbbox((0, 0), line, font=f_sub_text)
            lw = bbox[2] - bbox[0]
            draw.text(((WIDTH - lw) // 2, y_start), line, fill=(240, 240, 255), font=f_sub_text)
            y_start += 32

    # ── Progress bar ──
    prog = frame_idx / max(total_frames - 1, 1)
    draw.rectangle([0, HEIGHT - 4, WIDTH, HEIGHT], fill=(20, 20, 40))
    draw.rectangle([0, HEIGHT - 4, int(WIDTH * prog), HEIGHT], fill=color)

    return np.array(img)[:, :, ::-1].copy()  # RGB → BGR for OpenCV


# ── TTS ───────────────────────────────────────────────────────────────────────

def _generate_tts(script: str, out_mp3: str) -> bool:
    try:
        from gtts import gTTS
        print("[video_generator] Generating TTS audio...")
        gTTS(text=script, lang="en", slow=False).save(out_mp3)
        print(f"[video_generator] TTS ready: {Path(out_mp3).stat().st_size // 1024} KB")
        return True
    except Exception as e:
        print(f"[video_generator] TTS failed: {e}")
        return False


# ── Video builder ─────────────────────────────────────────────────────────────

def _build_video(role: str, script: str, out_path: str) -> bool:
    import cv2

    color, accent = ROLE_COLORS.get(role, ROLE_COLORS["Institute Owner"])
    avatar = _load_avatar(HEIGHT - 52 - 110)

    # Estimate duration from word count (~130 wpm)
    words = len(script.split())
    narration_sec = max(20, int(words / 130 * 60) + 4)
    intro_sec, outro_sec = 3, 3
    total_sec = intro_sec + narration_sec + outro_sec
    total_frames = total_sec * FPS

    # Build subtitle chunks for the main section
    main_frames = narration_sec * FPS
    chunks = _chunk_script(script, main_frames)

    def get_subtitle(main_frame_idx: int) -> str:
        for start, end, text in chunks:
            if start <= main_frame_idx < end:
                return text
        return ""

    fourcc = cv2.VideoWriter_fourcc(*"avc1")
    writer = cv2.VideoWriter(out_path, fourcc, FPS, (WIDTH, HEIGHT))
    if not writer.isOpened():
        fourcc = cv2.VideoWriter_fourcc(*"mp4v")
        writer = cv2.VideoWriter(out_path, fourcc, FPS, (WIDTH, HEIGHT))
    if not writer.isOpened():
        print("[video_generator] VideoWriter failed")
        return False

    print(f"[video_generator] Rendering {total_sec}s @ {FPS}fps = {total_frames} frames...")

    try:
        # Intro
        for i in range(intro_sec * FPS):
            frame = _render_frame(
                i, intro_sec * FPS, "", role, color, accent, avatar,
                "intro", i / max(intro_sec * FPS - 1, 1)
            )
            writer.write(frame)

        # Main (with subtitles)
        for i in range(main_frames):
            sub = get_subtitle(i)
            frame = _render_frame(
                intro_sec * FPS + i, total_frames, sub, role, color, accent, avatar,
                "main", i / max(main_frames - 1, 1)
            )
            writer.write(frame)

        # Outro
        for i in range(outro_sec * FPS):
            frame = _render_frame(
                intro_sec * FPS + main_frames + i, total_frames, "Stay ahead. Stay informed. Morning Pulse AI.",
                role, color, accent, avatar, "outro", i / max(outro_sec * FPS - 1, 1)
            )
            writer.write(frame)

    finally:
        writer.release()

    ok = Path(out_path).exists() and Path(out_path).stat().st_size > 10_000
    if ok:
        print(f"[video_generator] Silent video: {Path(out_path).stat().st_size // 1024} KB")
    return ok


def _merge_audio(video_path: str, audio_path: str, out_path: str) -> bool:
    try:
        from moviepy import VideoFileClip, AudioFileClip
        print("[video_generator] Merging audio + video...")
        video = VideoFileClip(video_path)
        audio = AudioFileClip(audio_path)

        # Trim audio to video duration with a small safety margin
        safe_dur = min(audio.duration - 0.1, video.duration)
        if safe_dur > 0:
            audio = audio.subclipped(0, safe_dur)

        final = video.with_audio(audio)
        final.write_videofile(
            out_path, codec="libx264", audio_codec="aac",
            fps=FPS, logger=None,
            temp_audiofile=out_path + ".tmp.m4a",
        )
        video.close(); audio.close(); final.close()
        print(f"[video_generator] Final video: {Path(out_path).stat().st_size // 1024} KB")
        return True
    except Exception as e:
        print(f"[video_generator] Merge failed: {e}")
        import traceback; traceback.print_exc()
        return False


# ── Public entry point ────────────────────────────────────────────────────────

def generate_briefing_video(role: str, report_data: dict) -> dict:
    tmp = tempfile.mkdtemp(prefix="mp_video_")
    try:
        print(f"[video_generator] Starting for {role}")

        # 1. Script
        script = generate_briefing_script(role, report_data)
        print(f"[video_generator] Script: {len(script)} chars")

        # 2. TTS audio
        audio_path = os.path.join(tmp, "narration.mp3")
        has_audio = _generate_tts(script, audio_path)

        # 3. Silent video
        silent_path = os.path.join(tmp, "silent.mp4")
        if not _build_video(role, script, silent_path):
            shutil.rmtree(tmp, ignore_errors=True)
            return {"success": False, "error": "Video rendering failed", "script": script}

        # 4. Merge audio into final output
        ts = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"briefing_{role.replace(' ', '_').replace('/', '-')}_{ts}.mp4"
        final_path = VIDEO_OUTPUT_DIR / filename

        merged = False
        if has_audio and Path(audio_path).exists():
            merged = _merge_audio(silent_path, audio_path, str(final_path))

        if not merged:
            # Fallback: copy silent video
            print("[video_generator] Using silent video as fallback")
            shutil.copy(silent_path, str(final_path))

        # Cleanup temp dir AFTER final file is written
        shutil.rmtree(tmp, ignore_errors=True)

        if not final_path.exists() or final_path.stat().st_size < 10_000:
            return {"success": False, "error": "Final video missing or too small", "script": script}

        size = final_path.stat().st_size
        print(f"[video_generator] Done — {size // 1024} KB, audio={merged}")
        return {
            "success": True,
            "video_url": f"/serve-video/{filename}",
            "video_filename": filename,
            "script": script,
            "role": role,
            "generated_at": datetime.now().strftime("%H:%M, %b %d %Y"),
            "file_size": size,
        }

    except Exception as e:
        shutil.rmtree(tmp, ignore_errors=True)
        import traceback; traceback.print_exc()
        return {"success": False, "error": str(e)}