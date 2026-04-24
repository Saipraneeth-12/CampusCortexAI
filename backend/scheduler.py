from apscheduler.schedulers.blocking import BlockingScheduler
import requests

scheduler = BlockingScheduler()

@scheduler.scheduled_job('cron', hour=8, minute=0)
def run_report():
    requests.get("http://127.0.0.1:8000/report")
    print("Morning Pulse generated!")

scheduler.start()