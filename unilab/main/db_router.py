class StudentsRouter:
    """
    Routes main.StudentProfile to the `students_db` connection
    (the `students` MariaDB database) and leaves everything else
    (including main.User and all of Django's own tables) on `default`
    (the `accounts` MariaDB database).
    """

    route_app_labels_models = {"studentprofile"}

    def db_for_read(self, model, **hints):
        if model._meta.model_name in self.route_app_labels_models:
            return "students_db"
        return None

    def db_for_write(self, model, **hints):
        if model._meta.model_name in self.route_app_labels_models:
            return "students_db"
        return None

    def allow_relation(self, obj1, obj2, **hints):
        # Allow the StudentProfile -> User relation even though they
        # live in different physical databases; Django just won't
        # enforce it as a real FK constraint across connections.
        return True

    def allow_migrate(self, db, app_label, model_name=None, **hints):
        if model_name in self.route_app_labels_models:
            return db == "students_db"
        return db == "default"