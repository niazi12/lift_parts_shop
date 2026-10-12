import json

from django.core.management.base import BaseCommand

from core.api import api


class Command(BaseCommand):
    help = "Write the OpenAPI schema, the contract the Next.js types are generated from."

    def add_arguments(self, parser):
        parser.add_argument("--output", default="openapi.json")

    def handle(self, *args, **options):
        schema = api.get_openapi_schema(path_prefix="/api/v1")
        with open(options["output"], "w") as f:
            json.dump(schema, f, indent=2, sort_keys=True)
            f.write("\n")
        self.stdout.write(f"Wrote {options['output']}")
