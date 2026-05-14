import axios from 'axios';
import { getToken, getUserAccount } from './authService';

const API_URL = "http://localhost:8080/";

export interface Enrollment {
    enrollment_id: Number,
    course_id: Number,
    user_id: Number,
    status: "ENROLLED" | "WAITLISTED" | "DROPPED",
    waitlist_position: Number
};


export const getCoursesStudents = async () => {
    const token = getToken();
    try {
        const res = await axios.get(`${API_URL+ "student/courses"}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return res.data;
    } catch (error) {
        console.error("Error recieving the members that we need: ", error);
        throw error;
    }
}


export const enrollInCourse = async (courseId : number) => {
    try {

        // 2. Decode JWT to get the user ID
        // Assuming your JWT payload has a field named 'userId' or 'sub'
        const token = getUserAccount();
        if(!token) throw new Error("Token not found, not authenticated!");
        const userId = token.id; 

        // 3. Build the Enrollment object
        // Match the structure of your Java Enrollment class
        const enrollmentData = {
            course: { courseId: courseId },
            student: { userId: userId },
            status: "ENROLLED" // Default status
        };

        // 4. Execute the Axios POST request
        const response = await axios.post(
            `http://localhost:8080/api/enroll/${courseId}`, 
            enrollmentData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        return response.data;
    } catch (error) {
        console.error("Enrollment failed:", error);
        throw error;
    }
};
