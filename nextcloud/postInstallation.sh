#!/usr/bin/env bash
php occ config:system:set --value=true --type=boolean debug
php occ log:manage --level=debug

php occ app:install oidc
php occ app:enable --force oidc
php occ app:enable --force upschoolingsupport

export OC_PASS=upschooling1234!
php occ user:add --password-from-env --display-name="Demo User 1" --group="users" demouser1
php occ user:add --password-from-env --display-name="Demo User 2" --group="users" demouser2

sqlite3 /var/www/html/data/nextcloud_db.db <<EOF
INSERT INTO oc_oidc_clients (
    id,
    name, 
    client_identifier, 
    secret, 
    signing_alg, 
    type, 
    flow_type
) VALUES (
    1,
    'Synapse', 
    'VgSUqiTshGQ8oWszLaTVfBo0DDfaGUC6DDhPHIWum5nQlFlEMiXnoKVBLDLeCVKp', 
    'N0ZlODQK0r5KgpQ77cVSqXfHbC6YGVzY1ig8H7fQ4qxiljEkQOIUbzRN1Fz9Ceyp',
    'RS256',
    'confidential',
    'code'
);
INSERT INTO oc_oidc_redirect_uris (
    id,
    client_id,
    redirect_uri
) VALUES (
    1,
    1,
    'http://localhost:8008/_synapse/client/oidc/callback'
);
EOF

echo "Header set Content-Security-Policy \"default-src * 'unsafe-inline' 'unsafe-eval'; script-src * 'unsafe-inline' 'unsafe-eval'; connect-src * 'unsafe-inline'; img-src * data: blob: 'unsafe-inline'; frame-src *; style-src * 'unsafe-inline';\"" >> /var/www/html/.htaccess