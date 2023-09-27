// Privilege
const dropPrivilegeTableSQL = 'DROP TABLE IF EXISTS privilege'
const createPrivilegeTableSQL = `CREATE TABLE privilege (
  privilege_id VARCHAR(12) NOT NULL,
  PRIMARY KEY (privilege_id),
  privilege_name TEXT NOT NULL,
  privilege_create_id VARCHAR(11) NOT NULL,
  privilege_create_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  privilege_create_ip VARCHAR(25) NOT NULL,
  privilege_update_id VARCHAR(11) DEFAULT NULL,
  privilege_update_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  privilege_update_ip VARCHAR(225) DEFAULT NULL,
  privilege_note TEXT DEFAULT NULL,
  privilege_status BOOLEAN NOT NULL
)`
const initialPrivilegeSQL = `INSERT INTO privilege (privilege_id, privilege_name, privilege_create_id, privilege_create_date, privilege_create_ip, privilege_update_id, privilege_update_date, privilege_update_ip, privilege_note, privilege_status) VALUES
('PR3107220001', 'Administrator', 'E0000000001', '2022-07-31', '192.168.18.36', 'E0000000001', '2022-07-31', '192.168.18.36', NULL, 1),
('PR3107220002', 'Lihat Customer', 'E0000000001', '2022-07-31', '192.168.18.36', 'E0000000001', '2022-07-31', '192.168.18.36', NULL, 1),
('PR3107220003', 'Buat Customer', 'E0000000001', '2022-07-31', '192.168.18.36', 'E0000000001', '2022-07-31', '192.168.18.36', NULL, 1),
('PR3107220004', 'Perbarui Customer', 'E0000000001', '2022-07-31', '192.168.18.36', 'E0000000001', '2022-07-31', '192.168.18.36', NULL, 1),
('PR3107220005', 'Hapus Customer', 'E0000000001', '2022-07-31', '192.168.18.36', 'E0000000001', '2022-07-31', '192.168.18.36', NULL, 1),
('PR3107220006', 'Lihat Produk', 'E0000000001', '2022-07-31', '192.168.18.36', 'E0000000001', '2022-07-31', '192.168.18.36', NULL, 1),
('PR3107220007', 'Buat Produk', 'E0000000001', '2022-07-31', '192.168.18.36', 'E0000000001', '2022-07-31', '192.168.18.36', NULL, 1),
('PR3107220008', 'Perbarui Produk', 'E0000000001', '2022-07-31', '192.168.18.36', 'E0000000001', '2022-07-31', '192.168.18.36', NULL, 1),
('PR3107220009', 'Hapus Produk', 'E0000000001', '2022-07-31', '192.168.18.36', 'E0000000001', '2022-07-31', '192.168.18.36', NULL, 1),
('PR3107220010', 'Lihat Jasa', 'E0000000001', '2022-07-31', '192.168.18.36', 'E0000000001', '2022-07-31', '192.168.18.36', NULL, 1),
('PR3107220011', 'Buat Jasa', 'E0000000001', '2022-07-31', '192.168.18.36', 'E0000000001', '2022-07-31', '192.168.18.36', NULL, 1),
('PR3107220012', 'Perbarui Jasa', 'E0000000001', '2022-07-31', '192.168.18.36', 'E0000000001', '2022-07-31', '192.168.18.36', NULL, 1),
('PR3107220013', 'Hapus Jasa', 'E0000000001', '2022-07-31', '192.168.18.36', 'E0000000001', '2022-07-31', '192.168.18.36', NULL, 1),
('PR3107220014', 'Lihat Pegawai', 'E0000000001', '2022-07-31', '192.168.18.36', 'E0000000001', '2022-07-31', '192.168.18.36', NULL, 1),
('PR3107220015', 'Buat Pegawai', 'E0000000001', '2022-07-31', '192.168.18.36', 'E0000000001', '2022-07-31', '192.168.18.36', NULL, 1),
('PR3107220016', 'Perbarui Pegawai', 'E0000000001', '2022-07-31', '192.168.18.36', 'E0000000001', '2022-07-31', '192.168.18.36', NULL, 1),
('PR3107220017', 'Hapus Pegawai', 'E0000000001', '2022-07-31', '192.168.18.36', 'E0000000001', '2022-07-31', '192.168.18.36', NULL, 1),
('PR3107220018', 'Lihat Promo', 'E0000000001', '2022-07-31', '192.168.18.36', 'E0000000001', '2022-07-31', '192.168.18.36', NULL, 1),
('PR3107220019', 'Buat Promo', 'E0000000001', '2022-07-31', '192.168.18.36', 'E0000000001', '2022-07-31', '192.168.18.36', NULL, 1),
('PR3107220020', 'Perbarui Promo', 'E0000000001', '2022-07-31', '192.168.18.36', 'E0000000001', '2022-07-31', '192.168.18.36', NULL, 1),
('PR3107220021', 'Hapus Promo', 'E0000000001', '2022-07-31', '192.168.18.36', 'E0000000001', '2022-07-31', '192.168.18.36', NULL, 1),
('PR3107220022', 'Lihat Transaksi', 'E0000000001', '2022-07-31', '192.168.18.36', 'E0000000001', '2022-07-31', '192.168.18.36', NULL, 1),
('PR3107220023', 'Buat Transaksi', 'E0000000001', '2022-07-31', '192.168.18.36', 'E0000000001', '2022-07-31', '192.168.18.36', NULL, 1),
('PR3107220024', 'Perbarui Transaksi', 'E0000000001', '2022-07-31', '192.168.18.36', 'E0000000001', '2022-07-31', '192.168.18.36', NULL, 1),
('PR3107220025', 'Hapus Transaksi', 'E0000000001', '2022-07-31', '192.168.18.36', 'E0000000001', '2022-07-31', '192.168.18.36', NULL, 1),
('PR3107220026', 'Ambil Jasa', 'E0000000001', '2022-07-31', '192.168.18.36', 'E0000000001', '2022-07-31', '192.168.18.36', NULL, 1),
('PR3107220027', 'Menugaskan Jasa', 'E0000000001', '2022-07-31', '192.168.18.36', 'E0000000001', '2022-07-31', '192.168.18.36', NULL, 1),
('PR3107220028', 'Lihat Laporan', 'E0000000001', '2022-07-31', '192.168.18.36', 'E0000000001', '2022-07-31', '192.168.18.36', NULL, 1)
`

// Customer
const dropCustomerTableSQL = 'DROP TABLE IF EXISTS customer'
const createCustomerTableSQL = `CREATE TABLE customer (
  customer_id VARCHAR(11) NOT NULL,
  PRIMARY KEY (customer_id),
  customer_name VARCHAR(255) NOT NULL,
  customer_phone_number VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_address TEXT NOT NULL,
  customer_create_id VARCHAR(11) NOT NULL,
  customer_create_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  customer_create_ip VARCHAR(25) NOT NULL,
  customer_update_id VARCHAR(11) DEFAULT NULL,
  customer_update_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  customer_update_ip VARCHAR(25) DEFAULT NULL,
  customer_note TEXT DEFAULT NULL,
  customer_status BOOLEAN NOT NULL
)`
const initialCustomerSQL = `INSERT INTO customer (customer_id, customer_name, customer_phone_number, customer_email, customer_address, customer_create_id, customer_create_date, customer_create_ip, customer_update_id, customer_update_date, customer_update_ip, customer_note, customer_status) VALUES
('C3107220001', 'Christian Zamorano Setiawan', '081235250435', 'zamoranochristian7@gmail.com', 'Rungkut Mapan Tengah III CC/11a', 'E0000000001', '2022-07-31', '192.168.18.36', 'E0000000001', '2022-07-31', '192.168.18.36', NULL, 1),
('C3107220002', 'Yosua Alexander Yuwono', '081231894694', 'yosua@gmail.com', 'Dewi Sartika Utara 3', 'E0000000001', '2022-07-31', '192.168.18.36', 'E0000000001', '2022-07-31', '192.168.18.36', NULL, 1)`

// Customer
const dropHCustomerTableSQL = 'DROP TABLE IF EXISTS h_customer'
const createHCustomerTableSQL = `CREATE TABLE h_customer (
  h_customer_id VARCHAR(12) NOT NULL,
  PRIMARY KEY (h_customer_id),
  h_customer_name VARCHAR(255) NOT NULL,
  h_customer_phone_number VARCHAR(255) NOT NULL,
  h_customer_email VARCHAR(255) NOT NULL,
  h_customer_address TEXT NOT NULL,
  h_customer_create_id VARCHAR(11) NOT NULL,
  h_customer_create_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  h_customer_create_ip VARCHAR(25) NOT NULL,
  h_customer_update_id VARCHAR(11) DEFAULT NULL,
  h_customer_update_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  h_customer_update_ip VARCHAR(25) DEFAULT NULL,
  h_customer_note TEXT DEFAULT NULL,
  h_customer_status BOOLEAN NOT NULL,
  h_customer_used BOOLEAN DEFAULT 0,
  FK_customer_id VARCHAR(11) NOT NULL
)`
const initialHCustomerSQL = `INSERT INTO h_customer (h_customer_id, h_customer_name, h_customer_phone_number, h_customer_email, h_customer_address, h_customer_create_id, h_customer_create_date, h_customer_create_ip, h_customer_update_id, h_customer_update_date, h_customer_update_ip, h_customer_note, h_customer_status, h_customer_used, FK_customer_id) VALUES
('HC3107220001', 'Christian Zamorano Setiawan', '081235250435', 'zamoranochristian7@gmail.com', 'Rungkut Mapan Tengah III CC/11a', 'E0000000001', '2022-07-31', '192.168.18.36', 'E0000000001', '2022-07-31', '192.168.18.36', NULL, 1, 1, 'C3107220001'),
('HC3107220002', 'Yosua Alexander Yuwono', '081231894694', 'yosua@gmail.com', 'Dewi Sartika Utara 3', 'E0000000001', '2022-07-31', '192.168.18.36', 'E0000000001', '2022-07-31', '192.168.18.36', NULL, 1, 1, 'C3107220002')
`

// DTrans
const dropDTransTableSQL = 'DROP TABLE IF EXISTS d_trans'
const createDTransTableSQL = `CREATE TABLE d_trans (
  d_trans_id VARCHAR(11) NOT NULL,
  PRIMARY KEY (d_trans_id),
  d_trans_create_id VARCHAR(11) NOT NULL,
  d_trans_create_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  d_trans_create_ip VARCHAR(25) NOT NULL,
  d_trans_update_id VARCHAR(11) DEFAULT NULL,
  d_trans_update_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  d_trans_update_ip VARCHAR(25) DEFAULT NULL,
  d_trans_note TEXT DEFAULT NULL,
  d_trans_done BOOLEAN DEFAULT 0,
  d_trans_quantity INT NOT NULL,
  d_trans_subtotal BIGINT(20) NOT NULL,
  d_trans_estimation INT NOT NULL,
  d_trans_status BOOLEAN NOT NULL,
  FK_h_product_id VARCHAR(12) NOT NULL,
  FK_h_employee_id VARCHAR(12) DEFAULT NULL,
  FK_h_trans_id VARCHAR(11) NOT NULL
)`
const insertDTransSQL = `INSERT INTO d_trans (d_trans_id, d_trans_create_id, d_trans_create_date, d_trans_create_ip, d_trans_update_id, d_trans_update_date, d_trans_update_ip, d_trans_note, d_trans_done, d_trans_quantity, d_trans_subtotal, d_trans_estimation, d_trans_status, FK_h_product_id, FK_h_employee_id, FK_h_trans_id) VALUES ?`
const initialDTransSQL = `INSERT INTO d_trans (d_trans_id, d_trans_create_id, d_trans_create_date, d_trans_create_ip, d_trans_update_id, d_trans_update_date, d_trans_update_ip, d_trans_note, d_trans_done, d_trans_quantity, d_trans_subtotal, d_trans_estimation, d_trans_status, FK_h_product_id, FK_h_employee_id, FK_h_trans_id) VALUES
('D0410220001', 'E0000000001', '2022-10-04', '::1',  'E0000000001', '2022-10-04', '::1', NULL, 0, 1, 150000, 0, 1, 'HP1209220001', NULL, 'T0410220001'),
('D0410220002', 'E0000000001', '2022-10-04', '::1',  'E0000000001', '2022-10-04', '::1', NULL, 0, 1, 75000, 0, 1, 'HP3107220002', NULL, 'T0410220001'),
('D0410220003', 'E0000000001', '2022-10-04', '::1',  'E0000000001', '2022-10-04', '::1', NULL, 0, 1, 70000, 0, 1, 'HP3107220002', 'HE1209220002', 'T0410220002')`

// HTrans
const dropHTransTableSQL = 'DROP TABLE IF EXISTS h_trans'
const createHTransTableSQL = `CREATE TABLE h_trans (
  h_trans_id VARCHAR(11) NOT NULL,
  PRIMARY KEY (h_trans_id),
  h_trans_main_photo VARCHAR(255) DEFAULT NULL,
  h_trans_main_note TEXT DEFAULT NULL,
  h_trans_top_photo VARCHAR(255) DEFAULT NULL,
  h_trans_top_note TEXT DEFAULT NULL,
  h_trans_left_photo VARCHAR(255) DEFAULT NULL,
  h_trans_left_note TEXT DEFAULT NULL,
  h_trans_right_photo VARCHAR(255) DEFAULT NULL,
  h_trans_right_note TEXT DEFAULT NULL,
  h_trans_below_photo VARCHAR(255) DEFAULT NULL,
  h_trans_below_note TEXT DEFAULT NULL,
  h_trans_total BIGINT(20) NOT NULL,
  h_trans_create_id VARCHAR(11) NOT NULL,
  h_trans_create_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  h_trans_create_ip VARCHAR(25) NOT NULL,
  h_trans_update_id VARCHAR(11) DEFAULT NULL,
  h_trans_update_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  h_trans_update_ip VARCHAR(25) DEFAULT NULL,
  h_trans_note TEXT DEFAULT NULL,
  h_trans_progress TINYINT(1) DEFAULT 0,
  h_trans_status BOOLEAN NOT NULL,
  FK_h_customer_id VARCHAR(12) NOT NULL,
  FK_h_promo_id VARCHAR(13) DEFAULT NULL
)`

const initialHTransSQL = `INSERT INTO h_trans (h_trans_id, h_trans_total, h_trans_create_id, h_trans_create_date, h_trans_create_ip, h_trans_update_id, h_trans_update_date, h_trans_update_ip, h_trans_note, h_trans_progress, h_trans_status, FK_h_customer_id, FK_h_promo_id) VALUES
('T0410220001', 225000, 'E0000000001', '2022-10-04', '::1',  'E0000000001', '2022-10-04', '::1', NULL, 0, 1, 'HC3107220002', NULL),
('T0410220002', 75000, 'E0000000001', '2022-10-04', '::1',  'E0000000001', '2022-10-04', '::1', NULL, 1, 1, 'HC3107220001', 'HPR170922003')`

// Promo
const dropPromoTableSQL = 'DROP TABLE IF EXISTS promo'
const createPromoTableSQL = `CREATE TABLE promo (
  promo_id VARCHAR(12) NOT NULL,
  PRIMARY KEY (promo_id),
  promo_name VARCHAR(255) NOT NULL,
  promo_description TEXT NOT NULL,
  promo_value BIGINT(20) NOT NULL,
  promo_is_percentage BOOLEAN DEFAULT 1,
  promo_min_total BIGINT(20) DEFAULT NULL,
  promo_max_discount BIGINT(20) DEFAULT NULL,
  promo_create_id VARCHAR(11) NOT NULL,
  promo_create_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  promo_create_ip VARCHAR(25) NOT NULL,
  promo_update_id VARCHAR(11) DEFAULT NULL,
  promo_update_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  promo_update_ip VARCHAR(25) DEFAULT NULL,
  promo_note TEXT DEFAULT NULL,
  promo_status BOOLEAN NOT NULL
)`
const initialPromoSQL = `
  INSERT INTO promo (promo_id, promo_name, promo_description, promo_value, promo_is_percentage, promo_min_total, promo_max_discount, promo_create_id, promo_create_date, promo_create_ip, promo_update_id, promo_update_date, promo_update_ip, promo_note, promo_status) VALUES
  ('PR1709220001', 'Promo Natal', 'Promo khusus hari natal', 15, 1, 100000, 15000, 'E0000000001', '2022-09-17', '::1', 'E0000000001', '2022-09-17', '::1', NULL, 1),
  ('PR1709220002', 'Promo Mingguan', 'Promo sekali per minggu', 5, 1, NULL, 35000, 'E0000000001', '2022-09-17', '::1', 'E0000000001', '2022-09-17', '::1', NULL, 1),
  ('PR1709220003', 'Promo Harian', 'Promo sekali per hari', 5000, 0, NULL, NULL, 'E0000000001', '2022-09-17', '::1', 'E0000000001', '2022-09-17', '::1', NULL, 1)
`

// Promo
const dropHPromoTableSQL = 'DROP TABLE IF EXISTS h_promo'
const createHPromoTableSQL = `CREATE TABLE h_promo (
  h_promo_id VARCHAR(13) NOT NULL,
  PRIMARY KEY (h_promo_id),
  h_promo_name VARCHAR(255) NOT NULL,
  h_promo_description TEXT NOT NULL,
  h_promo_value BIGINT(20) NOT NULL,
  h_promo_is_percentage BOOLEAN DEFAULT 1,
  h_promo_min_total BIGINT(20) DEFAULT NULL,
  h_promo_max_discount BIGINT(20) DEFAULT NULL,
  h_promo_create_id VARCHAR(11) NOT NULL,
  h_promo_create_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  h_promo_create_ip VARCHAR(25) NOT NULL,
  h_promo_update_id VARCHAR(11) DEFAULT NULL,
  h_promo_update_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  h_promo_update_ip VARCHAR(25) DEFAULT NULL,
  h_promo_note TEXT DEFAULT NULL,
  h_promo_status BOOLEAN NOT NULL,
  h_promo_used BOOLEAN DEFAULT 0,
  FK_promo_id VARCHAR(12) DEFAULT NULL
)`
const initialHPromoSQL = `
  INSERT INTO h_promo (h_promo_id, h_promo_name, h_promo_description, h_promo_value, h_promo_is_percentage, h_promo_min_total, h_promo_max_discount, h_promo_create_id, h_promo_create_date, h_promo_create_ip, h_promo_update_id, h_promo_update_date, h_promo_update_ip, h_promo_note, h_promo_status, h_promo_used, FK_promo_id) VALUES
  ('HPR1709220001', 'Promo Natal', 'Promo khusus hari natal', 15, 1, 100000, 15000, 'E0000000001', '2022-09-17', '::1', 'E0000000001', '2022-09-17', '::1', NULL, 1, 0, 'PR1709220001'),
  ('HPR1709220002', 'Promo Mingguan', 'Promo sekali per minggu', 5, 1, NULL, 35000, 'E0000000001', '2022-09-17', '::1', 'E0000000001', '2022-09-17', '::1', NULL, 1, 0, 'PR1709220002'),
  ('HPR1709220003', 'Promo Harian', 'Promo sekali per hari', 5000, 0, NULL, NULL, 'E0000000001', '2022-09-17', '::1', 'E0000000001', '2022-09-17', '::1', NULL, 1, 1, 'PR1709220003')
`

// HProduct
const dropHProductTableSQL = 'DROP TABLE IF EXISTS h_product'
const createHProductTableSQL = `CREATE TABLE h_product (
  h_product_id VARCHAR(12) NOT NULL,
  PRIMARY KEY (h_product_id),
  h_product_name VARCHAR(255) NOT NULL,
  h_product_type VARCHAR(255) NOT NULL,
  h_product_price BIGINT(20) NOT NULL,
  h_product_brand VARCHAR(255) DEFAULT NULL,
  h_product_category TEXT NOT NULL,
  h_product_create_id VARCHAR(11) NOT NULL,
  h_product_create_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  h_product_create_ip VARCHAR(25) NOT NULL,
  h_product_update_id VARCHAR(11) DEFAULT NULL,
  h_product_update_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  h_product_update_ip VARCHAR(25) DEFAULT NULL,
  h_product_note TEXT DEFAULT NULL,
  h_product_status BOOLEAN NOT NULL,
  h_product_used BOOLEAN DEFAULT 0,
  FK_product_id VARCHAR(11) NOT NULL
)`
const insertHProductSQL = `INSERT INTO h_product (h_product_id, h_product_price, h_product_create_id, h_product_create_date, h_product_create_ip, h_product_update_id, h_product_update_date, h_product_update_ip, h_product_note, h_product_status, FK_product_id) VALUES ?`
const initialHProductSQL = `INSERT INTO h_product (h_product_id, h_product_name, h_product_type, h_product_price, h_product_brand, h_product_category, h_product_create_id, h_product_create_date, h_product_create_ip, h_product_update_id, h_product_update_date, h_product_update_ip, h_product_note, h_product_status, h_product_used, FK_product_id) VALUES
('HP1209220001', 'Tali Sepatu', 'produk', 150000, 'nike', 'aksesoris', 'E0000000001', '2022-09-12', '::1', 'E0000000001', '2022-09-12', '::1', 'data dummy', 1, 1, 'P1209220001'),
('HP1209220002', 'Steam Dry', 'jasa', 60000, NULL, 'drying', 'E0000000001', '2022-09-12', '::1', 'E0000000001', '2022-09-12', '::1', 'data dummy', 1, 0, 'P1209220002'),
('HP3107220001', 'Wax', 'produk', 25000, 'kiwi', 'habis pakai', 'E0000000001', '2022-07-31', '192.168.18.36', 'E0000000001', '2022-07-31', '192.168.18.36', NULL, 1, 0, 'P3107220001'),
('HP3107220002', 'Deep Wash', 'jasa', 75000, NULL, 'washing', 'E0000000001', '2022-07-31', '192.168.18.36', 'E0000000001', '2022-07-31', '192.168.18.36', NULL, 1, 1, 'P3107220002'),
('HP3107220003', 'Repaint Sepatu', 'jasa', 75000, NULL, 'repaint', 'E0000000001', '2022-07-31', '192.168.18.36', 'E0000000001', '2022-07-31', '192.168.18.36', NULL, 1, 1, 'P3107220003')`

// Product
const dropProductTableSQL = 'DROP TABLE IF EXISTS product'
const createProductTableSQL = `CREATE TABLE product (
  product_id VARCHAR(11) NOT NULL,
  PRIMARY KEY (product_id),
  product_name VARCHAR(255) NOT NULL,
  product_type VARCHAR(255) NOT NULL,
  product_price BIGINT(20) NOT NULL,
  product_brand VARCHAR(255) DEFAULT NULL,
  product_stock int(11) NOT NULL,
  product_category TEXT NOT NULL,
  product_create_id VARCHAR(11) NOT NULL,
  product_create_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  product_create_ip VARCHAR(25) NOT NULL,
  product_update_id VARCHAR(11) DEFAULT NULL,
  product_update_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  product_update_ip VARCHAR(25) DEFAULT NULL,
  product_note TEXT DEFAULT NULL,
  product_status BOOLEAN NOT NULL
)`
const insertProductSQL = `INSERT INTO product (product_id, product_name, product_type, product_price, product_brand, product_stock, product_category, product_create_id, product_create_date, product_create_ip, product_update_id, product_update_date, product_update_ip, product_note, product_status) VALUES ?`
const initialProductSQL = `INSERT INTO product (product_id, product_name, product_type, product_price, product_brand, product_stock, product_category, product_create_id, product_create_date, product_create_ip, product_update_id, product_update_date, product_update_ip, product_note, product_status) VALUES
('P1209220001', 'Tali Sepatu', 'produk', 150000, 'nike', 50, 'aksesoris', 'E0000000001', '2022-09-12', '::1', 'E0000000001', '2022-09-12', '::1', 'data dummy', 1),
('P1209220002', 'Steam Dry', 'jasa', 60000, NULL, 5, 'drying', 'E0000000001', '2022-09-12', '::1', 'E0000000001', '2022-09-12', '::1', 'data dummy', 1),
('P3107220001', 'Wax', 'produk', 25000, 'kiwi', 50, 'habis pakai', 'E0000000001', '2022-07-31', '192.168.18.36', 'E0000000001', '2022-09-12', '192.168.18.36', NULL, 1),
('P3107220002', 'Deep Wash', 'jasa', 75000, NULL, 10, 'washing', 'E0000000001', '2022-07-31', '192.168.18.36', 'E0000000001', '2022-09-12', '192.168.18.36', NULL, 1),
('P3107220003', 'Repaint Sepatu', 'jasa', 75000, NULL, 10, 'repaint', 'E0000000001', '2022-07-31', '192.168.18.36', 'E0000000001', '2022-09-12', '192.168.18.36', NULL, 1)`

// Employee
const dropEmployeeTableSQL = 'DROP TABLE IF EXISTS employee'
const createEmployeeTableSQL = `CREATE TABLE employee (
  employee_id VARCHAR(11) NOT NULL,
  PRIMARY KEY (employee_id),
  employee_name VARCHAR(255) NOT NULL,
  employee_username VARCHAR(255) NOT NULL,
  employee_password VARCHAR(255) NOT NULL,
  employee_create_id VARCHAR(11) NOT NULL,
  employee_create_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  employee_create_ip VARCHAR(25) NOT NULL,
  employee_update_id VARCHAR(11) DEFAULT NULL,
  employee_update_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  employee_update_ip VARCHAR(25) DEFAULT NULL,
  employee_note TEXT DEFAULT NULL,
  employee_status BOOLEAN NOT NULL
)`

const dropHEmployeeTableSQL = `DROP TABLE IF EXISTS h_employee`
const createHEmployeeTableSQL = `CREATE TABLE h_employee(
  h_employee_id VARCHAR(12) NOT NULL,
  PRIMARY KEY (h_employee_id),
  h_employee_name VARCHAR(255) NOT NULL,
  h_employee_username VARCHAR(255) NOT NULL,
  h_employee_create_id VARCHAR(11) NOT NULL,
  h_employee_create_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  h_employee_create_ip VARCHAR(25) NOT NULL,
  h_employee_update_id VARCHAR(11) DEFAULT NULL,
  h_employee_update_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  h_employee_update_ip VARCHAR(25) DEFAULT NULL,
  h_employee_note TEXT DEFAULT NULL,
  h_employee_status BOOLEAN NOT NULL,
  FK_employee_id VARCHAR(11) NOT NULL
)`

// Employee Login
const dropEmployeeLoginTableSQL = 'DROP TABLE IF EXISTS employee_login'
const createEmployeeLoginTableSQL = `CREATE TABLE employee_login (
  employee_login_id VARCHAR(11) NOT NULL,
  PRIMARY KEY (employee_login_id),
  FK_employee_id VARCHAR(11) NOT NULL,
  employee_login_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  employee_login_ip VARCHAR(25) NOT NULL,
  employee_login_status BOOLEAN NOT NULL,
  employee_login_create_id VARCHAR(11) NOT NULL,
  employee_login_create_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  employee_login_create_ip VARCHAR(25) NOT NULL,
  employee_login_update_id VARCHAR(11) DEFAULT NULL,
  employee_login_update_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  employee_login_update_ip VARCHAR(25) NOT NULL
)`
const insertEmployeeLoginSQL = `INSERT INTO employee_login(employee_login_id, FK_employee_id, employee_login_date, employee_login_ip, employee_login_status, employee_login_create_id, employee_login_create_date, employee_login_create_ip, employee_login_update_id, employee_login_update_date, employee_login_update_ip) VALUES ?`
const initialEmployeeLoginSQL = `INSERT INTO employee_login(employee_login_id, FK_employee_id, employee_login_date, employee_login_ip, employee_login_status, employee_login_create_id, employee_login_create_date, employee_login_create_ip, employee_login_update_id, employee_login_update_date, employee_login_update_ip) VALUES
('L1209220001', 'E1209220001', '2022-09-12', '::1', 0, 'E0000000001', '2022-09-12', '::1', 'E0000000001', '2022-09-12', '::1'),
('L1209220002', 'E1209220001', '2022-09-12', '::1', 0, 'E0000000001', '2022-09-12', '::1', 'E0000000001', '2022-09-12', '::1')`

// Employee Privilege
const dropEmployeePrivilegeTableSQL = 'DROP TABLE IF EXISTS employee_privilege'
const createEmployeePrivilegeTableSQL = `CREATE TABLE employee_privilege (
  employee_privilege_id VARCHAR(12) NOT NULL,
  PRIMARY KEY (employee_privilege_id),
  employee_privilege_create_id VARCHAR(13) NOT NULL,
  employee_privilege_create_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  employee_privilege_create_ip VARCHAR(25) NOT NULL,
  employee_privilege_update_id VARCHAR(13) DEFAULT NULL,
  employee_privilege_update_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  employee_privilege_update_ip VARCHAR(25) DEFAULT NULL,
  employee_privilege_note TEXT DEFAULT NULL,
  employee_privilege_status BOOLEAN NOT NULL,
  FK_employee_id VARCHAR(11) NOT NULL,
  FK_privilege_id VARCHAR(12) NOT NULL
)`
const initialEmployeePrivilegeSQL = `INSERT INTO employee_privilege (employee_privilege_id, employee_privilege_create_id, employee_privilege_create_date, employee_privilege_create_ip, employee_privilege_update_id, employee_privilege_update_date, employee_privilege_update_ip, employee_privilege_note, employee_privilege_status, FK_employee_id, FK_privilege_id) VALUES
('EP3107220001', 'E0000000001', '2022-09-12', '192.168.18.36', 'E0000000001', '2022-09-12', '192.168.18.36', NULL, 1, 'E0000000001', 'PR3107220001'),
('EP3107220002', 'E0000000001', '2022-09-12', '192.168.18.36', 'E0000000001', '2022-09-12', '192.168.18.36', NULL, 1, 'E1209220001', 'PR3107220001'),
('EP3107220003', 'E0000000001', '2022-09-12', '192.168.18.36', 'E0000000001', '2022-09-12', '192.168.18.36', NULL, 1, 'E1209220002', 'PR3107220001'),
('EP3107220004', 'E0000000001', '2022-09-12', '192.168.18.36', 'E0000000001', '2022-09-12', '192.168.18.36', NULL, 1, 'E1209220003', 'PR3107220002'),
('EP3107220005', 'E0000000001', '2022-09-12', '192.168.18.36', 'E0000000001', '2022-09-12', '192.168.18.36', NULL, 1, 'E1209220003', 'PR3107220006'),
('EP3107220006', 'E0000000001', '2022-09-12', '192.168.18.36', 'E0000000001', '2022-09-12', '192.168.18.36', NULL, 1, 'E1209220003', 'PR3107220010'),
('EP3107220007', 'E0000000001', '2022-09-12', '192.168.18.36', 'E0000000001', '2022-09-12', '192.168.18.36', NULL, 1, 'E1209220003', 'PR3107220014'),
('EP3107220008', 'E0000000001', '2022-09-12', '192.168.18.36', 'E0000000001', '2022-09-12', '192.168.18.36', NULL, 1, 'E1209220003', 'PR3107220018'),
('EP3107220009', 'E0000000001', '2022-09-12', '192.168.18.36', 'E0000000001', '2022-09-12', '192.168.18.36', NULL, 1, 'E1209220003', 'PR3107220022'),
('EP3107220010', 'E0000000001', '2022-09-12', '192.168.18.36', 'E0000000001', '2022-09-12', '192.168.18.36', NULL, 1, 'E1209220003', 'PR3107220023'),
('EP3107220011', 'E0000000001', '2022-09-12', '192.168.18.36', 'E0000000001', '2022-09-12', '192.168.18.36', NULL, 1, 'E1209220003', 'PR3107220024'),
('EP3107220012', 'E0000000001', '2022-09-12', '192.168.18.36', 'E0000000001', '2022-09-12', '192.168.18.36', NULL, 1, 'E1209220003', 'PR3107220025'),
('EP3107220013', 'E0000000001', '2022-09-12', '192.168.18.36', 'E0000000001', '2022-09-12', '192.168.18.36', NULL, 1, 'E1209220004', 'PR3107220002'),
('EP3107220014', 'E0000000001', '2022-09-12', '192.168.18.36', 'E0000000001', '2022-09-12', '192.168.18.36', NULL, 1, 'E1209220004', 'PR3107220006'),
('EP3107220015', 'E0000000001', '2022-09-12', '192.168.18.36', 'E0000000001', '2022-09-12', '192.168.18.36', NULL, 1, 'E1209220004', 'PR3107220010'),
('EP3107220016', 'E0000000001', '2022-09-12', '192.168.18.36', 'E0000000001', '2022-09-12', '192.168.18.36', NULL, 1, 'E1209220004', 'PR3107220014'),
('EP3107220017', 'E0000000001', '2022-09-12', '192.168.18.36', 'E0000000001', '2022-09-12', '192.168.18.36', NULL, 1, 'E1209220004', 'PR3107220018'),
('EP3107220018', 'E0000000001', '2022-09-12', '192.168.18.36', 'E0000000001', '2022-09-12', '192.168.18.36', NULL, 1, 'E1209220004', 'PR3107220022'),
('EP3107220019', 'E0000000001', '2022-09-12', '192.168.18.36', 'E0000000001', '2022-09-12', '192.168.18.36', NULL, 1, 'E1209220004', 'PR3107220023'),
('EP3107220020', 'E0000000001', '2022-09-12', '192.168.18.36', 'E0000000001', '2022-09-12', '192.168.18.36', NULL, 1, 'E1209220004', 'PR3107220024'),
('EP3107220021', 'E0000000001', '2022-09-12', '192.168.18.36', 'E0000000001', '2022-09-12', '192.168.18.36', NULL, 1, 'E1209220004', 'PR3107220025'),
('EP3107220022', 'E0000000001', '2022-09-12', '192.168.18.36', 'E0000000001', '2022-09-12', '192.168.18.36', NULL, 1, 'E1209220004', 'PR3107220027'),
('EP3107220023', 'E0000000001', '2022-09-12', '192.168.18.36', 'E0000000001', '2022-09-12', '192.168.18.36', NULL, 1, 'E1209220005', 'PR3107220022'),
('EP3107220024', 'E0000000001', '2022-09-12', '192.168.18.36', 'E0000000001', '2022-09-12', '192.168.18.36', NULL, 1, 'E1209220005', 'PR3107220026'),
('EP3107220025', 'E0000000001', '2022-09-12', '192.168.18.36', 'E0000000001', '2022-09-12', '192.168.18.36', NULL, 1, 'E1209220006', 'PR3107220022'),
('EP3107220026', 'E0000000001', '2022-09-12', '192.168.18.36', 'E0000000001', '2022-09-12', '192.168.18.36', NULL, 1, 'E1209220006', 'PR3107220026')
`

export const dropTables = {
  dropHCustomerTableSQL,
  dropCustomerTableSQL,
  dropDTransTableSQL,
  dropHProductTableSQL,
  dropHTransTableSQL,
  dropHPromoTableSQL,
  dropPromoTableSQL,
  dropPrivilegeTableSQL,
  dropProductTableSQL,
  dropEmployeeLoginTableSQL,
  dropEmployeePrivilegeTableSQL,
  dropEmployeeTableSQL,
  dropHEmployeeTableSQL,
}

export const createTables = {
  createHCustomerTableSQL,
  createCustomerTableSQL,
  createDTransTableSQL,
  createHProductTableSQL,
  createHTransTableSQL,
  createPrivilegeTableSQL,
  createProductTableSQL,
  createEmployeeLoginTableSQL,
  createEmployeePrivilegeTableSQL,
  createHEmployeeTableSQL,
  createEmployeeTableSQL,
  createHPromoTableSQL,
  createPromoTableSQL,
}

export const insertSQL = {
  insertDTransSQL,
  insertHProductSQL,
  insertProductSQL,
  insertEmployeeLoginSQL,
}

export const initialRecords = {
  initialHCustomerSQL,
  initialCustomerSQL,
  initialDTransSQL,
  initialHProductSQL,
  initialHTransSQL,
  initialPrivilegeSQL,
  initialProductSQL,
  initialHPromoSQL,
  initialPromoSQL,
  initialEmployeeLoginSQL,
  initialEmployeePrivilegeSQL,
}
