INSERT INTO
  auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    recovery_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
  )
VALUES
  (
    '00000000-0000-0000-0000-000000000000',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'authenticated',
    'authenticated',
    'admin@lenu.com',
    crypt('admin123', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "Admin Lenu"}',
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    'b2c3d4e5-f6a7-8901-bcde-f23456789012',
    'authenticated',
    'authenticated',
    'user@lenu.com',
    crypt('user123', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "Usuário Teste"}',
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
  );

INSERT INTO
  auth.identities (
    id,
    user_id,
    provider_id,
    identity_data,
    provider,
    last_sign_in_at,
    created_at,
    updated_at
  )
VALUES
  (
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'admin@lenu.com',
    '{"sub": "a1b2c3d4-e5f6-7890-abcd-ef1234567890", "email": "admin@lenu.com"}',
    'email',
    NOW(),
    NOW(),
    NOW()
  ),
  (
    'b2c3d4e5-f6a7-8901-bcde-f23456789012',
    'b2c3d4e5-f6a7-8901-bcde-f23456789012',
    'user@lenu.com',
    '{"sub": "b2c3d4e5-f6a7-8901-bcde-f23456789012", "email": "user@lenu.com"}',
    'email',
    NOW(),
    NOW(),
    NOW()
  );

INSERT INTO
  public.books (id, user_id, title, author, isbn, description, status, created_at, updated_at)
VALUES
  (
    gen_random_uuid(),
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'O Senhor dos Anéis: A Sociedade do Anel',
    'J.R.R. Tolkien',
    '9788533613379',
    'A primeira parte da trilogia épica de fantasia.',
    'available',
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    '1984',
    'George Orwell',
    '9788535914849',
    'Clássico distópico sobre vigilância e controle.',
    'available',
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'Dom Quixote',
    'Miguel de Cervantes',
    '9788544001011',
    'A obra-prima da literatura espanhola.',
    'available',
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'Cem Anos de Solidão',
    'Gabriel García Márquez',
    '9788501012173',
    'O clássico do realismo mágico latino-americano.',
    'rented',
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'O Pequeno Príncipe',
    'Antoine de Saint-Exupéry',
    '9788595081512',
    'Uma fábula poética sobre amor e amizade.',
    'available',
    NOW(),
    NOW()
  );

INSERT INTO
  public.customers (id, user_id, name, email, phone, address, created_at, updated_at)
VALUES
  (
    gen_random_uuid(),
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'João Silva',
    'joao.silva@email.com',
    '(11) 99999-1234',
    'Rua das Flores, 123 - São Paulo, SP',
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'Maria Santos',
    'maria.santos@email.com',
    '(11) 98888-5678',
    'Av. Paulista, 1000 - São Paulo, SP',
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'Pedro Oliveira',
    'pedro.oliveira@email.com',
    '(21) 97777-9012',
    'Rua Copacabana, 500 - Rio de Janeiro, RJ',
    NOW(),
    NOW()
  );
