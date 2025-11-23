from werkzeug.serving import run_simple
from apscheduler.schedulers.background import BackgroundScheduler
from app.app import new_app
from config.config import config
from ctx.ctx import new_ctx


if __name__ == "__main__":
    import os
    import atexit

    ctx = new_ctx(config)
    app = new_app(ctx)
    if os.environ.get('WERKZEUG_RUN_MAIN') == 'true':
        scheduler = BackgroundScheduler()
        scheduler.add_job(
            func=ctx.sync_usecase.start,
            trigger="interval",
            hours=1,
            id='wikidata_sync',
            name='sync_wikidata_every_hour',
            replace_existing=True
        )
        scheduler.start()
        app.config['scheduler'] = scheduler
        atexit.register(lambda: scheduler.shutdown())

    ctx.sync_usecase.start()
    run_simple(config["host"], config["port"], app, use_reloader=True)
