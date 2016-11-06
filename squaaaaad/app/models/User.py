from system.core.model import Model
import re
EMAIL_REGEX = re.compile(r'^[a-za-z0-9\.\+_-]+@[a-za-z0-9\._-]+\.[a-za-z]*$')

class User(Model):
    def __init__(self):
        super(User, self).__init__()

    def get_user_by_email(self, users):
        errors = []
        if not users['email1']:
            errors.append('Email cannot be blank')
        elif not EMAIL_REGEX.match(users['email1']):
            errors.append('Email format must be valid!')
        if not users['password1']:
            errors.append('Password cannot be blank')
        elif len(users['password1']) < 8:
            errors.append('Password must be at least 8 characters long')

        user_query = "SELECT * FROM user WHERE email = :email LIMIT 1"
        data = { 'email' : users['email1'] }
 # same as query_db() but returns one result
        try:
            user = self.db.query_db(user_query, data)
        except Exception as e:
            errors.append('email or password does not exsist')
            return { 'status' : False, 'errors' : errors }


        # Some basic validation
        if user:
            print 'got to user'
           # check_password_hash() compares encrypted password in DB to one provided by user logging in
            if self.bcrypt.check_password_hash(user[0]['password'], users['password1']):
                print 'if'
                return {'status' : True, 'user' : user[0]}
            else:
                print 'else'
                errors.append('Invalid email or password')
        # Whether we did not find the email, or if the password did not match, either way return False
        return {'status': False, 'errors' : errors}
        #return self.db.query_db(query, data)

    def add_users(self, users):
        errors = []

        if not users['alias']:
            errors.append('Name cannot be blank')
        elif len(users['alias']) < 2:
            errors.append('Name must be at least 2 characters long')
        if not users['email']:
            errors.append('Email cannot be blank')
        elif not EMAIL_REGEX.match(users['email']):
            errors.append('Email format must be valid!')
        if not users['password']:
            errors.append('Password cannot be blank')
        elif len(users['password']) < 8:
            errors.append('Password must be at least 8 characters long')
        elif users['password'] != users['con_password']:
            errors.append('Password and confirmation must match!')
        print 'before checker'
        if errors:
            return {'status' : False, 'errors': errors}
        else:
            hashed_pw = self.bcrypt.generate_password_hash(users['password'])
            query = "INSERT INTO user (alias, email, password, admin_status) VALUES (:alias, :email, :password, :admin_status)"
            data = { 'alias': users['alias'], 'email' : users['email'], 'password' : hashed_pw, 'admin_status' : 0 }
            try:
                result = self.db.query_db(query, data)
            except Exception as e:
                errors.append('Email already in use')
                return { 'status' : False, 'errors' : errors }
            select = "SELECT * FROM user WHERE id = :id"
            data = {
                'id' : result
                }
            user = self.db.query_db(select,data)
            return {'status' : True, 'user' : user[0]}

    def update_user_by_id(self, id, users):
        errors = []
        if not users['email']:
            errors.append('Email cannot be blank')
        elif len(users['email']) < 2:
            errors.append('Email must be at least 2 characters long')
        check = self.db.query_db('SELECT * FROM user WHERE id = :id', {'id': id})
        hashed_pw = self.bcrypt.check_password_hash(check[0]['password'], users['password'])
        if hashed_pw == False:
            errors.append('Password is incorrect')
        if errors:
            return {'status': False, 'errors' : errors}
        else:
            update = "UPDATE user SET email = :email, password = :password WHERE id = :id"
            data = {
            'id': id,
            'email' : users['email'],
            'password': hashed_pw,
            }
            result = self.db.query_db(update, data)
            return {'status' : True, 'result' : result}

    def update_prefrences_by_id(self, id, form_data):
        try:
            update = "UPDATE preference SET gender = :gender, dependent = :dependent, faith = :faith, income = :income, user_id = :user_id WHERE id = :id"
            data = {
            'gender' : form_data['gender'],
            'dependent' : form_data['dependent'],
            'faith' : form_data['faith'],
            'income' : form_data['income'],
            'user_id' : id
            }
            self.db.query_db(update, data)
            return {'status' : True}
        except:
            return {'status' : False}

    def insert_preferences(self, id, form_data):
        try:
            insert = "INSERT INTO preference (gender,dependent,faith,income,user_id) VALUES (:gender, :dependent, :faith, :income, :user_id)"
            data = {
            'gender' : form_data['gender'],
            'dependent' : form_data['dependent'],
            'faith' : form_data['faith'],
            'income' : form_data['income'],
            'user_id' : form_data['user_id']
            }
            result = self.db.query_db(insert,data)
            if result:
                return {'status' : True}
        except:
                return {'status' : False}

    def get_preferences_by_id(self, id):
        select = "SELECT * FROM preference WHERE user_id = :id"
        data = {
            'id' : id
            }
        user_pref = self.db.query_db(select, data)
        return {'status' : True, 'user_pref': user_pref}

    def get_feedback_by_active_status(self):
        select = "SELECT * FROM feedback WHERE active = 1 ORDER BY updated_at DESC"
        feedback = self.db.query_db(select)
