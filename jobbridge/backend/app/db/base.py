# Imported by Alembic and by main.py's create_all() so every model is registered
# against the shared Base metadata before tables are created/migrated.
from app.db.base_class import Base  # noqa
from app.models.user import User  # noqa
from app.models.resume import Resume  # noqa
from app.models.job_preference import JobPreference  # noqa
from app.models.career_link import CareerLink  # noqa
from app.models.feedback import Feedback  # noqa
from app.models.hr_message import HRMessage  # noqa
