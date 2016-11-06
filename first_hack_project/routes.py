from system.core.router import routes


routes['default_controller'] = 'Users'
routes['/admin'] = 'Users#admin'

routes['POST']['/updateSP'] = 'Users#adminUpdateSP'
routes['POST']['/addSP'] = 'Users#adminAddSP'
routes['POST']['/process'] = 'Users#process'
routes['POST']['/results'] = 'Users#results'
