# StudyNova [```live```](https://studynova-abhikant.vercel.app/)

StudyNova is a fully functional ed-tech learning platform that enables users to create, consume, and rate educational content. The platform is built using the ```MERN stack```, which includes ```ReactJS```, ```NodeJS```, ```MongoDB```, and ```ExpressJS```.

### StudyNova aims to provide:
* A seamless and interactive learning experience for students, making education more accessible and engaging.
* A platform for instructors to showcase their expertise and connect with learners across the globe.

## Front-end
The front end of StudyNova has all the necessary pages that an ed-tech platform should have. Some of these pages are:

### For Students:
1. **Homepage:**
    - Brief introduction to the platform
    - Links to the course list and user details
    - Overview of key features such as Virtual Study Room, Discussion Forums, Progress Tracking, and Doubt Support

2. **Course List:**
    - List of all available courses
    - Course descriptions
    - Course ratings
    - Option to add courses to wishlist or cart

3. **Wishlist:**
    - Display of courses added to the student's wishlist
    - Option to remove courses from the wishlist
    - Option to move courses from wishlist to cart

4. **Cart Checkout:**
    - Overview of courses in the cart
    - Payment options
    - Confirmation of course purchase

5. **Course Content:**
    - Detailed content for a particular course
    - Videos and other related materials
    - Links to Discussion Forums for the course
    - Progress Tracking for the course

6. **User Details:**
    - Student's account details including name, email, etc.
    - Overview of enrolled courses
    - Links to edit account details

7. **User Edit Details:**
    - Form to edit account details like name, email, and password

8. **Virtual Study Room:**
    - Create or join a virtual study room with video and audio capabilities
    - Real-time chat, collaborative whiteboard, and screen share functionality within the study room

9. **Discussion Forums:**
    - Interactive forums where students and instructors can engage in discussions and answer queries

10. **Progress Tracking:**
    - Track learning progress with detailed analytics and reports for students and instructors

11. **Doubt Support:**
    - Get your doubts resolved quickly with dedicated support from instructors and peers.


### For Instructors:
1. **Dashboard:**
    - Overview of the instructor's courses
    - Ratings and feedback for each course

2. **Insights:**
    - Detailed insights into the instructor's courses
    - Number of views, clicks, and other relevant metrics

3. **Course Management Pages:**
    - Create, update, and delete courses
    - Manage course content and pricing

4. **View and Edit Profile Details:**
    - View and edit account details.


### For Admin:
1. **Dashboard:**
    - Overview of the platform's courses, instructors, and students

2. **Insights:**
    - Detailed insights into the platform's metrics
    - Number of registered users, courses, and revenue

3. **Instructor Management:**
    - Manage the platform's instructors
    - Account details, courses, and ratings

4. **Other Relevant Pages:**
    - Access to user management and course management pages

## Back-end
The back end of StudyNova provides a range of features and functionalities, including:

1. **User Authentication and Authorization:**
    - Students and instructors can sign up and log in using their email addresses and password
    - Supports OTP (One-Time Password) verification and forgot password functionality for added security

2. **Course Management:**
    - Instructors can create, read, update, and delete courses
    - Manage course content and media
    - Students can view and rate courses

3. **Payment Integration:**
    - Students can purchase and enroll in courses by completing the checkout flow
    - Razorpay integration for payment handling

4. **Cloud-based Media Management:**
    - StudyNova uses Cloudinary to store and manage all media content, including images, videos, and documents

5. **Markdown Formatting:**
    - Course content in document format is stored in Markdown format
    - Easier display and rendering on the front end


## Installation and Setup

This starter pack includes a basic setup for using **Tailwind CSS with React**. To start building your own components and styles, follow these steps:

1. Clone the repository to your local machine.
    ```sh
    git clone https://github.com/abhikant12/Study-Nova.git
    ```

2. Install the required packages.
    ```sh
    npm install
    ```

3. Start the development server.
    ```sh
    npm run dev
    ```

4. Open the project in your browser at [http://localhost:3000](http://localhost:3000) to view your project.

## Contributing

Contributions are welcome! If you have any suggestions or find any issues, please feel free to open an issue or a pull request.

## Contact
- Email: abhiparnav12@gmail.com
- LinkedIn: [Abhikant Kumar](https://www.linkedin.com/in/abhikant12/)
- Website: [Abhikant Kumar](https://abhikant-portfolio.netlify.app/)
