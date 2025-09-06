# Polling Application

A comprehensive polling application built with Spring Boot, allowing admins to create and manage polls while users can participate in voting and view results.

## Features

### Admin Features
- Register admin accounts
- Create polls with multiple options
- View all created polls
- View poll results and analytics
- Deactivate or delete polls
- Update poll details

### User Features
- Register user accounts
- View active polls
- Vote on polls (one vote per poll per user)
- View poll results
- Check voting status

## Technology Stack

- **Backend Framework**: Spring Boot 3.2.0
- **Database**: MySQL 8.0
- **ORM**: Spring Data JPA with Hibernate
- **Build Tool**: Maven
- **Java Version**: 17
- **Additional Libraries**: 
  - Lombok for reducing boilerplate code
  - Spring Boot DevTools for development
  - H2 Database for testing

## Database Schema

### Tables

#### `users`
- `id` (BIGINT, Primary Key, Auto Increment)
- `username` (VARCHAR, Unique, Not Null)
- `email` (VARCHAR, Unique, Not Null)
- `password` (VARCHAR, Not Null)
- `first_name` (VARCHAR)
- `last_name` (VARCHAR)
- `created_at` (DATETIME)
- `updated_at` (DATETIME)

#### `admins`
- `id` (BIGINT, Primary Key, Auto Increment)
- `username` (VARCHAR, Unique, Not Null)
- `email` (VARCHAR, Unique, Not Null)
- `password` (VARCHAR, Not Null)
- `first_name` (VARCHAR)
- `last_name` (VARCHAR)
- `created_at` (DATETIME)
- `updated_at` (DATETIME)

#### `polls`
- `id` (BIGINT, Primary Key, Auto Increment)
- `title` (VARCHAR, Not Null)
- `description` (TEXT)
- `is_active` (BOOLEAN, Default: true)
- `admin_id` (BIGINT, Foreign Key to admins)
- `created_at` (DATETIME)
- `updated_at` (DATETIME)
- `ends_at` (DATETIME, Optional)

#### `poll_options`
- `id` (BIGINT, Primary Key, Auto Increment)
- `option_text` (VARCHAR, Not Null)
- `vote_count` (INT, Default: 0)
- `poll_id` (BIGINT, Foreign Key to polls)
- `created_at` (DATETIME)

#### `poll_responses`
- `id` (BIGINT, Primary Key, Auto Increment)
- `user_id` (BIGINT, Foreign Key to users)
- `poll_id` (BIGINT, Foreign Key to polls)
- `poll_option_id` (BIGINT, Foreign Key to poll_options)
- `response_date` (DATETIME)
- **Unique Constraint**: (user_id, poll_id) - Ensures one vote per user per poll

## Setup Instructions

### Prerequisites

1. **Java 17 or higher** installed
2. **Maven 3.6+** installed
3. **MySQL 8.0+** installed and running
4. **IDE** (IntelliJ IDEA, Eclipse, or VS Code with Java extensions)

### Database Setup

1. **Create Database and User**:
   ```sql
   CREATE DATABASE polling_db;
   CREATE USER 'polling_user'@'localhost' IDENTIFIED BY 'polling_password';
   GRANT ALL PRIVILEGES ON polling_db.* TO 'polling_user'@'localhost';
   FLUSH PRIVILEGES;
   ```

   Or use root user by updating `application.properties`:
   ```properties
   spring.datasource.username=root
   spring.datasource.password=your_root_password
   ```

2. **Verify Connection**:
   ```bash
   mysql -u polling_user -p polling_db
   ```

### Application Setup

1. **Clone/Navigate to Project Directory**:
   ```bash
   cd polling-app
   ```

2. **Update Database Configuration** (if needed):
   Edit `src/main/resources/application.properties` to match your database setup.

3. **Build the Project**:
   ```bash
   mvn clean compile
   ```

4. **Run the Application**:
   ```bash
   mvn spring-boot:run
   ```

5. **Verify Application**:
   - The application will start on `http://localhost:8080`
   - Check logs for any errors
   - Tables will be automatically created due to `spring.jpa.hibernate.ddl-auto=update`

## API Endpoints

### User Endpoints

#### User Management
- `POST /api/user/register` - Register a new user
- `GET /api/user/{userId}` - Get user details
- `PUT /api/user/{userId}` - Update user details

#### Polling
- `GET /api/user/polls/active` - Get all active polls
- `GET /api/user/polls/{pollId}` - Get specific poll details
- `GET /api/user/polls/{pollId}/options` - Get poll options
- `POST /api/user/{userId}/polls/{pollId}/vote` - Submit vote
- `GET /api/user/{userId}/polls/{pollId}/voted` - Check if user has voted
- `GET /api/user/polls/{pollId}/results` - View poll results

### Admin Endpoints

#### Admin Management
- `POST /api/admin/register` - Register a new admin
- `GET /api/admin/{adminId}` - Get admin details
- `PUT /api/admin/{adminId}` - Update admin details

#### Poll Management
- `POST /api/admin/{adminId}/polls` - Create a new poll
- `GET /api/admin/{adminId}/polls` - Get all polls by admin
- `GET /api/admin/{adminId}/polls/active` - Get active polls by admin
- `PUT /api/admin/{adminId}/polls/{pollId}` - Update poll
- `PATCH /api/admin/{adminId}/polls/{pollId}/deactivate` - Deactivate poll
- `DELETE /api/admin/{adminId}/polls/{pollId}` - Delete poll
- `GET /api/admin/polls/{pollId}/results` - Get detailed poll results
- `GET /api/admin/polls/{pollId}/options` - Get poll options

## Sample API Usage

### Create a User
```bash
curl -X POST http://localhost:8080/api/user/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

### Create an Admin
```bash
curl -X POST http://localhost:8080/api/admin/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin_user",
    "email": "admin@example.com",
    "password": "admin123",
    "firstName": "Admin",
    "lastName": "User"
  }'
```

### Create a Poll
```bash
curl -X POST http://localhost:8080/api/admin/1/polls \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Favorite Programming Language",
    "description": "What is your favorite programming language?",
    "options": ["Java", "Python", "JavaScript", "C++"]
  }'
```

### Submit a Vote
```bash
curl -X POST http://localhost:8080/api/user/1/polls/1/vote \
  -H "Content-Type: application/json" \
  -d '{
    "optionId": 1
  }'
```

## Development

### Running Tests
```bash
mvn test
```

### Building for Production
```bash
mvn clean package
java -jar target/polling-app-0.0.1-SNAPSHOT.jar
```

## Configuration

Key configuration properties in `application.properties`:

```properties
# Server Configuration
server.port=8080

# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/polling_db
spring.datasource.username=polling_user
spring.datasource.password=polling_password

# JPA Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

## Project Structure

```
polling-app/
├── src/
│   ├── main/
│   │   ├── java/com/polling/app/
│   │   │   ├── controller/          # REST Controllers
│   │   │   ├── entity/              # JPA Entities
│   │   │   ├── repository/          # Data Repositories
│   │   │   ├── service/             # Business Logic
│   │   │   └── PollingApplication.java
│   │   └── resources/
│   │       └── application.properties
│   └── test/
├── pom.xml
└── README.md
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

This project is licensed under the MIT License.
