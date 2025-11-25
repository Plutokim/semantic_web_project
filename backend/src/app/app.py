from flask import Flask, jsonify, request
from ctx.ctx import Context


def new_app(ctx: Context):
    app = Flask(__name__)

    @app.route("/health")
    def health():
        return jsonify({"status": "ok"})

    @app.route("/institutions")
    def get_institutions():
        search_text = request.args.get('search')

        cities_param = request.args.get('city')
        cities = cities_param.split(',') if cities_param else None

        inst_type = request.args.get('type')

        institutions = ctx.institution_usecase.get_all(
            search_text=search_text,
            cities=cities,
            inst_type=inst_type
        )

        return jsonify({"institutions": institutions})

    return app


