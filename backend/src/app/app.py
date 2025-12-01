from flask import Flask, jsonify, request
from ctx.ctx import Context


def new_app(ctx: Context):
    app = Flask(__name__)

    @app.route("/health")
    def health():
        return jsonify({"status": "ok"})

    @app.route("/institutions")
    def get_institutions_by_filter():
        search_text = request.args.get('search')

        cities_param = request.args.get('city')
        cities = cities_param.split(',') if cities_param else None

        inst_types_param = request.args.get('type')
        inst_types = inst_types_param.split(',') if inst_types_param else None

        institutions = ctx.institution_usecase.search(
            search_text=search_text,
            cities=cities,
            inst_type=inst_types
        )

        return jsonify({"institutions": institutions})

    @app.route("/institutions/<item_id>")
    def get_institution(item_id):
        institution = ctx.institution_usecase.search(item_id=item_id)
        if not institution:
            return jsonify({"error": "Not found"}), 404

        return jsonify({"institution": institution})

    @app.route("/filters")
    def get_all_filters():
        locations = ctx.institution_usecase.get_filters(entity='location')
        types = ctx.institution_usecase.get_filters(entity='type')
        return jsonify({"locations": locations, "types": types})

    return app


