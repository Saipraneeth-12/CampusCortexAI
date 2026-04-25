import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Download, Loader, AlertCircle, Film } from "lucide-react";
import { useRole, ROLE_META } from "@/context/RoleContext";
import { api, API_BASE } from "@/lib/api";

interface VideoBriefingState {
  loading: boolean;
  error: string | null;
  videoUrl: string | null;
  videoFilename: string | null;
  script: string | null;
  generatedAt: string | null;
}

export function VideoBriefing() {
  const { role } = useRole();
  const meta = ROLE_META[role];
  const [state, setState] = useState<VideoBriefingState>({
    loading: false,
    error: null,
    videoUrl: null,
    videoFilename: null,
    script: null,
    generatedAt: null,
  });
  const [showScript, setShowScript] = useState(false);

  const generateVideo = async () => {
    setState({
      loading: true,
      error: null,
      videoUrl: null,
      videoFilename: null,
      script: null,
      generatedAt: null,
    });

    try {
      const result = await api.generateVideo(role);
      
      if (!result.success) {
        setState(prev => ({
          ...prev,
          loading: false,
          error: result.error || "Failed to generate video",
        }));
        return;
      }

      // Prefix with backend base URL so the browser fetches from port 8000
      const fullVideoUrl = result.video_url.startsWith("http")
        ? result.video_url
        : `${API_BASE}${result.video_url}`;

      setState({
        loading: false,
        error: null,
        videoUrl: fullVideoUrl,
        videoFilename: result.video_filename,
        script: result.script,
        generatedAt: result.generated_at,
      });
    } catch (e) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: (e as Error).message || "Failed to generate video",
      }));
    }
  };

  const downloadVideo = () => {
    if (state.videoUrl) {
      const link = document.createElement("a");
      link.href = state.videoUrl;
      link.download = state.videoFilename || "briefing.mp4";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="glass neon-border rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-[oklch(0.7_0.24_255)] to-[oklch(0.65_0.28_300)]">
          <Film className="h-5 w-5 text-white" />
        </div>
        <div>
          <h2 className="font-display text-lg font-semibold">AI CEO Briefing Video</h2>
          <p className="text-xs text-muted-foreground">60-second personalized market briefing</p>
        </div>
      </div>

      {state.error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 flex items-start gap-3 rounded-xl bg-[oklch(0.72_0.27_340/0.15)] p-3 border border-[oklch(0.72_0.27_340/0.3)]"
        >
          <AlertCircle className="h-4 w-4 text-[oklch(0.72_0.27_340)] mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-medium text-[oklch(0.72_0.27_340)]">Generation Failed</p>
            <p className="text-xs text-[oklch(0.72_0.27_340/0.8)] mt-1">{state.error}</p>
          </div>
        </motion.div>
      )}

      {state.videoUrl ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* Video Player — compact size */}
          <div className="relative overflow-hidden rounded-xl bg-black" style={{ maxWidth: "560px", margin: "0 auto" }}>
            <div className="aspect-video">
              <video
                key={state.videoUrl}
                src={state.videoUrl ?? undefined}
                controls
                autoPlay={false}
                crossOrigin="anonymous"
                className="w-full h-full"
                onError={() => setState(prev => ({ ...prev, error: "Video failed to load. Try regenerating." }))}
              >
                Your browser does not support the video tag.
              </video>
            </div>
          </div>

          {/* Metadata */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-white/5 p-3">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Generated</p>
              <p className="text-sm font-medium mt-1">{state.generatedAt}</p>
            </div>
            <div className="rounded-lg bg-white/5 p-3">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Role</p>
              <p className="text-sm font-medium mt-1">{role}</p>
            </div>
          </div>

          {/* Script Preview */}
          <div className="rounded-lg bg-white/5 p-3">
            <button
              onClick={() => setShowScript(!showScript)}
              className="flex items-center justify-between w-full text-sm font-medium hover:text-[oklch(0.85_0.18_200)] transition-colors"
            >
              <span>📝 Briefing Script</span>
              <span className="text-xs">{showScript ? "Hide" : "Show"}</span>
            </button>
            <AnimatePresence>
              {showScript && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-3 pt-3 border-t border-border/30"
                >
                  <p className="text-xs leading-relaxed text-muted-foreground whitespace-pre-wrap">
                    {state.script}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={generateVideo}
              disabled={state.loading}
              className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-gradient-to-br from-[oklch(0.7_0.24_255)] to-[oklch(0.65_0.28_300)] px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              <Play className="h-4 w-4" />
              Regenerate
            </button>
            <button
              onClick={downloadVideo}
              className="flex-1 flex items-center justify-center gap-2 rounded-lg border border-border/60 bg-white/5 px-4 py-2 text-sm font-medium hover:bg-white/10 transition-colors"
            >
              <Download className="h-4 w-4" />
              Download MP4
            </button>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          <div className="rounded-lg bg-white/5 p-6 text-center">
            <div className="text-4xl mb-3">🎬</div>
            <p className="text-sm text-muted-foreground mb-4">
              Generate a personalized 60-second AI video briefing of today's market intelligence
            </p>
            <p className="text-xs text-muted-foreground/60">
              The video will feature an AI avatar explaining key insights, trends, and opportunities tailored to your role.
            </p>
          </div>

          <button
            onClick={generateVideo}
            disabled={state.loading}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-gradient-to-br from-[oklch(0.7_0.24_255)] to-[oklch(0.65_0.28_300)] px-4 py-3 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            {state.loading ? (
              <>
                <Loader className="h-4 w-4 animate-spin" />
                Generating Video...
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                🎬 Generate AI Briefing
              </>
            )}
          </button>

          {state.loading && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Loader className="h-3 w-3 animate-spin" />
                <span>Generating your personalized video briefing...</span>
              </div>
              <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-[oklch(0.7_0.24_255)] to-[oklch(0.65_0.28_300)]"
                  animate={{ x: ["0%", "100%"] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
