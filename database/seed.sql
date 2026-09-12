USE administracion_liceos;

INSERT INTO institution_settings (id, institution_name, logo_url, default_monthly_fee)
SELECT UUID(), 'Liceo San José', NULL, 80.00
WHERE NOT EXISTS (SELECT 1 FROM institution_settings);

INSERT INTO students
(id, first_name, last_name, grade, section, representative_name, representative_phone, monthly_fee)
VALUES
(UUID(), 'María', 'González', '5to Año', 'A', 'Carlos González', '0412-1234567', 80.00),
(UUID(), 'Carlos', 'Rodríguez', '3er Año', 'B', 'Laura Rodríguez', '0414-2223344', 80.00),
(UUID(), 'Ana', 'Martínez', '2do Año', 'A', 'Pedro Martínez', '0416-3334455', 80.00),
(UUID(), 'José', 'Hernández', '4to Año', 'C', 'Marta Hernández', '0424-5556677', 80.00),
(UUID(), 'Sofía', 'Pérez', '1er Año', 'A', 'Luis Pérez', '0412-7778899', 80.00);

INSERT INTO payments
(id, student_id, payment_month, amount, currency, payment_method, status)
SELECT UUID(), id, '2026-09-01', 80.00, 'USD', 'Zelle', 'verified'
FROM students
WHERE first_name = 'María' AND last_name = 'González'
LIMIT 1;

INSERT INTO payments
(id, student_id, payment_month, amount, currency, payment_method, status)
SELECT UUID(), id, '2026-09-01', 80.00, 'USD', 'Transferencia', 'verified'
FROM students
WHERE first_name = 'José' AND last_name = 'Hernández'
LIMIT 1;
