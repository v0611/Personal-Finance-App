SET FOREIGN_KEY_CHECKS = 0;
SET AUTOCOMMIT = 0;

DROP TABLE IF EXISTS Users, Categories, Transactions, Tags, TransactionTags;
-- Create Users table
CREATE TABLE Users (
    userID INT AUTO_INCREMENT PRIMARY KEY,
    userName VARCHAR(255) NOT NULL,
    userEmail VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
);

-- Sample Data for Users
INSERT INTO Users (userName, userEmail, password) VALUES
('Sabrena', 'sabrina@example.com', 'password789'),
('TateMcRae', 'Tate@example.com', 'passwordabc'),
('MeganTS', 'MeganTS@example.com', 'passwordxyz');

-- Create Categories table
CREATE TABLE Categories (
    categoryID INT AUTO_INCREMENT PRIMARY KEY,
    categoryName VARCHAR(50) NOT NULL UNIQUE,
    categoryType ENUM('income', 'expense') NOT NULL
);

-- Sample Data for Categories
INSERT INTO Categories (categoryName, categoryType) VALUES
('Salary', 'income'),
('Freelance', 'income'),
('Transportation', 'expense'),
('Food', 'expense'),
('Health & Beauty', 'expense');

-- Create Transactions table
-- ON DELETE CASCADE for userID to delete transactions if a user is deleted
-- ON DELETE SET NULL for categoryID to set categoryID to NULL if a category is deleted
CREATE TABLE Transactions (
    transactionID INT AUTO_INCREMENT PRIMARY KEY,
    userID INT NOT NULL,
    categoryID INT,
    amount DECIMAL(10, 2) NOT NULL,
    date DATE NOT NULL,
    description VARCHAR(255),
    FOREIGN KEY (userID) REFERENCES Users(userID) ON DELETE CASCADE,
    FOREIGN KEY (categoryID) REFERENCES Categories(categoryID) 
);

-- Sample Data for Transactions categorized as either income or expense
INSERT INTO Transactions (userID, categoryID, amount, date, description) VALUES
(1, 3, 25.00, '2024-06-10', 'Uber back to hotel Miami June 2024'),              -- Transportation (Expense)
(1, 4, 45.00, '2024-07-10', 'Lyft to client site'),             				-- Transportation (Expense)
(1,	1, 25000.00,'2024-06-15', 'Monthly salary from main job'),					-- Salary (income)
(1,	2, 450.00, '2024-06-18', 'Consulting work for ABC Co'),						-- Freelance (income)

(2,4, 76.00, '2024-07-10', 'Groceries for dinnner')								-- Food (Expense)

;
-- Create Tags table
CREATE TABLE Tags (
    tagID INT AUTO_INCREMENT PRIMARY KEY,
    tagName VARCHAR(50) NOT NULL UNIQUE
);

-- Sample Data for Tags
INSERT INTO Tags (tagName) VALUES
('Rideshare'), ('Uber'), ('Lyft'),
('Dining Out'), ('Groceries'), ('Whole Foods'), ('Target'),
('Salary'), 
('Upwork'), ('Consulting'), ('Work-related'),
('Recurring'), ('One Off'), ('Vacation');

-- Create TransactionTags table.
CREATE TABLE TransactionTags (
    transactionID INT NOT NULL,
    tagID INT,
    PRIMARY KEY (transactionID, tagID),
    FOREIGN KEY (transactionID) REFERENCES Transactions(transactionID) ON DELETE CASCADE,
    FOREIGN KEY (tagID) REFERENCES Tags(tagID) 
);


-- Sample Data for TransactionTags 
-- Transportation Expenses (Uber/Lyft, Vacation, Work-related)
INSERT INTO TransactionTags (transactionID, tagID) VALUES
(1, 1), (1, 2), (1, 15),        -- Transaction #1: Rideshare, Uber, Vacation
(2,11), (2,3),					-- Transaction #2: Work related, Lyft
(3,8),							-- Transaction #3: Work-related
(4,9),
(5,4), (5,5)					-- Transaction #4: Groceries for dinner
;

SET FOREIGN_KEY_CHECKS = 1;
COMMIT;