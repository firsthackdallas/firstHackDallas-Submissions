from system.core.model import Model

class Service(Model):
    def __init__(self):
        super(Service, self).__init__()

    def profile(self, id):
        profile = self.db.query_db('SELECT s.id sid, s.name s_name, description, hours, phone, email, website, faith_based, gender_based, dependent_based, income_restriction, DATE_FORMAT(s.updated_at, "%b %d %Y %h: %i %p") s_date, req_doc, t.name FROM service s JOIN service_type st ON st.service_id = s.id JOIN type t ON t.id = st.type_id WHERE s.id = :id', {'id': id})
        return profile[0]

    def add_service(self, info):
        query = 'INSERT INTO service (name, description, hours, phone, email, website, faith_based, gender_based, dependent_based, income_restriction, req_doc) VALUES (:name, :description, :hours, :phone, :email, :website, :faith_based, :gender_based, :dependent_based, :income_restriction, :req_doc)'
        id = self.db.query_db(query, info)
        if (info['type_name_new']):
            tid = self.db.query_db('INSERT INTO type (name) VALUES (:name)', info)
        else:
            tid = self.db.query_db('SELECT id FROM type WHERE name = :name', info)
        query = 'INSERT INTO service_type (service_id, type_id) VALUES (:id, :tid)'

        add = self.db.query_db(query, {'id': id, 'tid': tid})
        return add

    def update_service(self, info):
        self.db.query_db('UPDATE service SET name = :name, description = :description, hours = :hours, phone = :phone, email = :email, website = :website, faith_based = :faith_based, gender_based = :gender_based, dependent_based = :dependent_based, income_restriction = :income_restriction, req_doc = :req_doc, updated_at = Now() WHERE id = :id',info)
        if (info['type_name_new']):
            tid = self.db.query_db('INSERT INTO type (name) VALUES (:name)', info)
        else:
            tid = self.db.query_db('SELECT id FROM type WHERE name = :name', info)
        update = self.db.query_db('UPDATE service_type SET type_id = :tid, updated_at = Now()', {'tid': tid})
        return update

    def result_specific(self, name):
        result = self.db.query_db('SELECT s.id sid, s.name s_name, description, hours, phone, email, website, faith_based, gender_based, dependent_based, income_restriction, DATE_FORMAT(s.updated_at, "%b %d %Y %h: %i %p") s_date, req_doc, t.name FROM service s JOIN service_type st ON st.service_id = s.id JOIN type t ON t.id = st.type_id WHERE :name = 1', {'name': name})
        return result
        # This route is for when they search for services with one elegibility requirement, like in the right box on page 4

    def get_pref_for_dash(self, id):
        info = self.db.query_db("SELECT * FROM preference WHERE user_id = :id", {'id': id})
        print(info)
#        answer = {
#            gender_based: info['gender_based'],
#            dependent_based: info['dependent_based'],
#            faith_based: info['faith_based'],
#            income_restriction: info['income_restriction'],
#            req_doc: info['req_doc']
#        }
        return info

    def select_services(self, info):
        if len(info) < 1:
            return info
        result = self.db.query_db('SELECT s.id sid, s.name s_name, description, hours, phone, email, website, faith_based, gender_based, dependent_based, income_restriction, DATE_FORMAT(s.updated_at, "%b %d %Y %h: %i %p") s_date, req_doc, t.name FROM service s JOIN service_type st ON st.service_id = s.id JOIN type t ON t.id = st.type_id WHERE gender_based = :gender_based and faith_based = :faith_based and dependent_based = :dependent_based and income_restriction = :income_restriction and req_doc = :req_doc', info)
        return result

    def select_all(self):
        result = self.db.query_db('SELECT s.id sid, s.name s_name, description, hours, phone, email, website, faith_based, gender_based, dependent_based, income_restriction, DATE_FORMAT(s.updated_at, "%b %d %Y %h: %i %p") s_date, req_doc, t.name FROM service s JOIN service_type st ON st.service_id = s.id JOIN type t ON t.id = st.type_id')
        return result
