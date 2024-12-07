from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from apscheduler import AsyncScheduler
from apscheduler.triggers.cron import CronTrigger
from blacksheep.server import Application



def some_job():
    ...

def configure_scheduler(app: Application):
    async def start_scheduler():
        scheduler = await AsyncScheduler().__aenter__()
        app.services.add_instance(scheduler)

        session: AsyncSession = app.services.provider[AsyncSession]
        async with session:
            await scheduler.add_schedule(some_job, CronTrigger(hour='1', minute='2'), id="weather_message")
        # s = await scheduler.get_schedules()
        # for i in s:
        #     print("scheduler id:", i.id, i.next_fire_time)
        await scheduler.start_in_background()

    async def stop_scheduler():
        scheduler: AsyncScheduler = app.services.provider[AsyncScheduler]
        await scheduler.__aexit__(None, None, None)

    app.on_start += start_scheduler
    app.on_stop += stop_scheduler

    # sudo fuser -k 5000/tcp
