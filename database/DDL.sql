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
('Sabrina', 'sabrina@example.com', 'password789'),
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
('Food', 'expense');

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
(1, 4, 25.00, '2024-06-10', 'Uber Ride - Vacation'),              -- Transportation (Expense)
(2, 4, 30.00, '2024-06-11', 'Lyft Ride - Vacation'),              -- Transportation (Expense)
(1, 5, 60.00, '2024-06-14', 'Dining Out - Vacation'),             -- Food (Expense)
(2, 5, 45.00, '2024-06-15', 'Dining Out - Work-related'),         -- Food (Expense)
(1, 5, 120.00, '2024-06-16', 'Groceries - Whole Foods'),          -- Food (Expense)
(2, 5, 85.00, '2024-06-17', 'Groceries - Target'),                -- Food (Expense)
(1, 1, 5000.00, '2024-06-18', 'Monthly Salary'),                  -- Salary (Income)
(2, 2, 1200.00, '2024-06-19', 'Freelance - Upwork'),              -- Freelance (Income)
(2, 2, 1300.00, '2024-06-20', 'Freelance - Consulting'),          -- Freelance (Income)
(2, 2, 1100.00, '2024-06-21', 'Freelance - Contractor');          -- Freelance (Income)


-- Create Tags table
CREATE TABLE Tags (
    tagID INT AUTO_INCREMENT PRIMARY KEY,
    tagName VARCHAR(50) NOT NULL UNIQUE
);

-- Sample Data for Tags
INSERT INTO Tags (tagName) VALUES
('Rideshare'), ('Uber'), ('Lyft'),
('Dining Out'), ('Groceries'), ('Whole Foods'),
('Target'), ('Salary'), ('Freelance'),
('Upwork'), ('Consulting'), ('Contractor'),
('Recurring'), ('One-Time'), ('Vacation'), ('Work-related');

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
(1, 3), (1, 4), (1, 1),        -- Transaction #1: Rideshare, Uber, Vacation
(2, 3), (2, 5), (2, 1),        -- Transaction #2: Rideshare, Lyft, Vacation
(3, 6), (3, 1),                -- Transaction #3: Dining Out, Vacation
(4, 6), (4, 2),                -- Transaction #4: Dining Out, Work-related
(5, 7), (5, 8),                -- Transaction #5: Groceries, Whole Foods
(6, 7), (6, 9),                -- Transaction #6: Groceries, Target
(7, 10), (7, 15),              -- Transaction #7: Salary, Recurring
(8, 11), (8, 12), (8, 16),     -- Transaction #8: Freelance, Upwork, One-Time
(9, 11), (9, 13), (9, 16),     -- Transaction #9: Freelance, Consulting, One-Time
(10, 11), (10, 14), (10, 16);  -- Transaction #10: Freelance, Contractor, One-Time

SET FOREIGN_KEY_CHECKS = 1;
COMMIT;