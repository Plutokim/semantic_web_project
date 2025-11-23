from flask import Flask, jsonify
from ctx.ctx import Context


def new_app(ctx: Context):
    app = Flask(__name__)

    @app.route("/health")
    def health():
        return jsonify({"status": "ok"})

    @app.route("/institutions")
    def get_institutions():
        institutions = ctx.institution_usecase.get_all()
        return jsonify({"institutions": institutions})

    return app
