INSERT IGNORE INTO `role` VALUES ('0',1688521740430,'admin.qlsc@daiduongtelecom.com',NULL,0,NULL,'ROLE_ADMIN'),
    ('1',1688521765499,'admin.qlsc@daiduongtelecom.com',NULL,0,NULL,'ROLE_QLPO'),
    ('2',1688521755239,'admin.qlsc@daiduongtelecom.com',NULL,0,NULL,'ROLE_USER'),
    ('3',1688521765499,'admin.qlsc@daiduongtelecom.com',NULL,0,NULL,'ROLE_QLSC'),
    ('4',1688521765499,'admin.qlsc@daiduongtelecom.com',NULL,0,NULL,'ROLE_KCSANALYST'),
    ('5',1688521765499,'admin.qlsc@daiduongtelecom.com',NULL,0,NULL,'ROLE_MANAGER');

INSERT IGNORE INTO `user` VALUES ('9f2f3996-16c0-43db-b734-0dc02e6f46d8',1688521881246,'keyhoangvu@gmail.com',NULL,0,NULL,'truongninh@daiduongtelecom.com','DAI DUONG TELECOM','$2a$12$SrLAbMgjDphRI1.57suosuhNnCxXwbkD7y3GUYnDdUZqJd5YGTzSC','0123456789',1);

INSERT INTO user_role (user_id, role_id)
SELECT '9f2f3996-16c0-43db-b734-0dc02e6f46d8', '0'
    WHERE NOT EXISTS (
  SELECT 1 FROM user_role
  WHERE user_id = '9f2f3996-16c0-43db-b734-0dc02e6f46d8' AND role_id = '0'
);