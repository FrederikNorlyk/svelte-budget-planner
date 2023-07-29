CREATE TABLE budget_accounts(
    id INT GENERATED ALWAYS AS IDENTITY,
    user_id INT NOT NULL,
    name VARCHAR(255) NOT NULL UNIQUE,
   
    PRIMARY KEY(id)
);

CREATE TABLE budget_expenses(
    id INT GENERATED ALWAYS AS IDENTITY,
    user_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    frequency INT NOT NULL,
    tag VARCHAR(255) NOT NULL,
    account_id INT NOT NULL,
    is_enabled BOOLEAN NOT NULL DEFAULT true,
    
    PRIMARY KEY(id),
    
    CONSTRAINT fk_account
        FOREIGN KEY(account_id) 
            REFERENCES budget_accounts(id)
);

CREATE TABLE budget_payment_dates(
    id INT GENERATED ALWAYS AS IDENTITY,
    expense_id INT NOT NULL,
    day_of_month INT NOT NULL,
    month INT NOT NULL,
   
    PRIMARY KEY(id),

    CONSTRAINT fk_expense
        FOREIGN KEY(expense_id) 
            REFERENCES budget_expenses(id)
                ON DELETE CASCADE
);