sqlite3 /var/www/html/data/homeserver.db <<EOF
INSERT INTO oc_oidc_clients (
    name, 
    password_hash, 
    admin
) VALUES (
    '@supporter1:localhost:8008',
    '$2b$12$I0gqEr9wDY8EhwcBdT8ytuDIF8eEEtrFYDJv664ZhIHwDlC42n1vO', 
    1
),(
    '@supporter2:localhost:8008',
    '$2b$12$btNYaqJJyqAYsOBSNrnvU.C0I/tTYldeJT5VSAxlr.U.TDCZ4Q3me	', 
    0
);

INSERT INTO rooms (
    room_id,
    is_public,
    creator,
    room_version,

) VALUES (
    1,
    1,
    '@supporter1:localhost:8008',
    'http://localhost:8008/_synapse/client/oidc/callback'
);
EOF
