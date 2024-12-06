
# API Round - IRCTC

## How to Run the Project

### Setup Instructions

#### 1. Clone the Repository

```bash
git clone https://github.com/sd1p/Work-India
cd cd Work-India
```

#### 2. Install Dependencies

```bash
npm install
```

#### 3. Set Up Environment Variables

Copy the example `.env` file and add the necessary environment keys.

```bash
cp .env.example .env
```

Edit the `.env` file and update it with your configuration.

#### 4. Run the Application

```bash
npm start
```

---

## Technologies Used

Backend: Node.js, Express.js, Prisma ORM
Database: PostGres (Supabase Free Tier)

## How concurrecy is handled?

1. I have used row level locking for each booking transaction.
2. I have used a queue to handle the booking requests, queue is processed one by one.
