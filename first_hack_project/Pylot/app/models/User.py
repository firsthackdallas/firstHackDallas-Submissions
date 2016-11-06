from system.core.model import Model
from flask import session
import re

EMAIL_REGEX = re.compile(r'^[a-za-z0-9\.\+_-]+@[a-za-z0-9\._-]+\.[a-za-z]*$')

class User(Model):
    def __init__(self):
        super(User, self).__init__()

    def register(self,user):
        errors = []
        if not user['email']:
            errors.append('Email cannot be blank')
        elif not EMAIL_REGEX.match(user['email']):
            errors.append('Email format must be valid!')

        if not user['alias']:
            errors.append('Username cannot be blank')
        elif len(user['alias']) < 3:
            errors.append('Username must be at least 3 characters long')

        if not user['zip']:
            errors.append('Zipcode cannot be blank')
        elif len(user['zip']) != 5:
            errors.append('Zipcode must be 5 numbers')

        if not user['password']:
            errors.append('Password cannot be blank')
        elif len(user['password']) < 8:
            errors.append('Password must be at least 8 characters long')
        elif user['password'] != user['confirm']:
            errors.append('Password and confirmation must match!')

        if errors:
            return {"status": False, "errors": errors}

        hashed_pw = self.bcrypt.generate_password_hash(user['password'])
        query = "INSERT INTO User (email,alias,pw_hash,zip,type) VALUES (:email,:alias,:pw_hash,:zip,'2')"
        data = {
            'email':user['email'],
            'alias':user['alias'],
            'pw_hash':hashed_pw,
            'zip':user['zip']
        }
        self.db.query_db(query,data)
        query = "SELECT * FROM User ORDER BY id DESC LIMIT 1"
        users = self.db.query_db(query)
        return { "status": True, "user": users[0] }

    def login(self,user):
        errors = []
        password = user['password']
        query = "SELECT * FROM User WHERE alias = :alias LIMIT 1"
        data = {'alias':user['alias']}
        user = self.db.query_db(query,data)

        if user:
            if self.bcrypt.check_password_hash(user[0]['pw_hash'],password):
                return { "status": True, "user": user[0] }
            else:
                errors.append('Email or password incorrect!')
        else:
            errors.append('Email or password incorrect!')
        return {"status": False, "errors": errors}

    def logout(self):
        session.clear()
        return self

    def displayServices(self):
        query = "SELECT name, description FROM service"
        return self.db.query_db(query)

    def displayResults(self,zip):
        query = "SELECT sp.name, sp.address, sp.phone, sp.zip, sp.faith, e.income, e.gender, e.dependants, service.name FROM ServiceProvider sp JOIN serviceprovider_has_service shs ON shs.serviceprovider_id = sp.id JOIN service ON service.id = shs.service_id WHERE service.name = :services"
        data = {'services':services}
        return self.db.query_db(query,data)

    def displayAdmin(self):
        query = "SELECT sp.name, sp.address, sp.zip, sp.phone, sp.faith FROM serviceprovider sp"
        return self.db.query_db(query)

    def addSP(self,sp,el):
        query = "SELECT e.gender,e.income,e.dependants,e.zip FROM eligibility e"
        eligible = self.db.query_db(query)
        query = "SELECT s.name FROM service s"
        service = self.db.query_db(query)
        query = "INSERT INTO serviceprovider(name,street,city,state,zip,phone) VALUES(:name,:city,:state,:zip,:phone)"
        data = {
            'name':sp['name'],
            'street':sp['street'],
            'city':sp['city'],
            'state':sp['state'],
            'zip':sp['zip'],
            'phone':sp['phone']
        }
        self.db.query_db(query,data)
        query = "INSERT INTO eligibility(gender,income,dependants,zip) VALUES(:gender,:income,:dependants,:zip)"
        data = {
            'gender':el['gender'],
            'income':el['income'],
            'dependants':el['dependants'],
            'zip':el['zip']
        }
        self.db.query_db(query,{'eligibility':el['eligibility']})
        query = "INSERT INTO serviceprovider_has_eligibility(serviceprovider_id,eligibility_id) VALUES (:spid,:eid)"
        data = {
            'spid':sp['id'],
            'eid':sp['id']
        }
        self.db.query_db(query,data)
        return eligible,service

        def updateSP(self,provider):
            query = "UPDATE eligibility SET gender=:gender,income=:income,dependants=:dependants,zip=:zip WHERE serviceprovider.id = :id"
            data = {
                'gender':provider['gender'],
                'income':provider['income'],
                'dependants':provider['dependants'],
                'zip':provider['zip'],
                # 'id':provider['id']
            }
            self.db.query_db(query,data)
            query = "UPDATE serviceprovider SET name=:name,address=:address,phone=:phone,zip=:zip,faith=:faith,city=:city,state=:state WHERE id=:id"
            data = {
                'name':provider['name'],
                'address':provider['address'],
                'phone':provider['phone'],
                'zip':provider['zip'],
                'faith':provider['faith'],
                'city':provider['city'],
                'state':provider['state'],
                # 'id':provider['id']
            }
            self.db.query_db(query,data)
            return self
