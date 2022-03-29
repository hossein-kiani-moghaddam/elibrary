
CREATE TABLE Users (
	id int(11) NOT NULL AUTO_INCREMENT COMMENT 'کد',
	userName varchar(50) NOT NULL COMMENT 'نام',
	email varchar(100) NOT NULL COMMENT 'ایمیل',
	hashPassword varchar(256) NOT NULL COMMENT 'کلمه عبور',
	PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_persian_ci AUTO_INCREMENT=1;

CREATE TABLE Books (
	id int(11) NOT NULL AUTO_INCREMENT COMMENT 'کد',
	title varchar(100) NOT NULL COMMENT 'عنوان',
	fileName varchar(10) NOT NULL COMMENT 'نام فایل',
	thumbnail varchar(10) DEFAULT NULL COMMENT 'فایل تصویر',
	publication varchar(50) DEFAULT NULL COMMENT 'انتشارات',
	authors varchar(80) DEFAULT NULL COMMENT 'مؤلفان',
	pagesCount int(11) NOT NULL COMMENT 'تعداد صفحه',
	pubYear int(11) NOT NULL COMMENT 'سال انتشار',
	PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_persian_ci AUTO_INCREMENT=1;

CREATE TABLE Favorites (
	userId int(11) NOT NULL COMMENT 'کد کاربر',
	bookId int(11) NOT NULL COMMENT 'کد کتاب',
	PRIMARY KEY (userId, bookId),
	FOREIGN KEY Fk_Favorites_1 (userId) REFERENCES Users (id) ON UPDATE CASCADE ON DELETE CASCADE,
	FOREIGN KEY Fk_Favorites_2 (bookId) REFERENCES Books (id) ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_persian_ci;
