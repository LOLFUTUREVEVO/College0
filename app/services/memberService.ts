import axios from "axios";


const API_URL = "http://localhost:8080/";

export type Status = "PENDING" | "APPROVED" | "REJECTED" | "DISABLED";


export interface MemberData {
  firstName: string;
  lastName: string;
  userName: string;
  hsGpa: Number;
  role: string;
  major?: string;
  status?: string;
  dob?: string;
  userId: Number;
}

// Add Team interface for member data
export interface Team {
  id: number;
  teamNumber: number;
  name: string;
  program: 'FRC' | 'FTC' | 'FLL';
  inNyc: boolean;
  location?: any;
}

export interface ApprovalRequest {
    id: number;
    approve: boolean;
    status: Status;
}


export const createMember = async (memberData: MemberData) => {
    try {
        // Transform the data to match backend expectations
        const transformedData = {
            first_name: memberData.firstName,
            last_name: memberData.lastName,
            role: memberData.role,
            dob: memberData.dob || null,
        };

        // Remove any undefined values, but keep null values
        const cleanedData = Object.fromEntries(
            Object.entries(transformedData).filter(([_, value]) => value !== undefined)
        );

        console.log("Cleaned data being sent to backend:", cleanedData);

        const response = await axios.post(`${API_URL}`, cleanedData);
        return response.data;
    } catch (error) {
        console.error("Error creating member: ", error);
        throw error;
    }
};

export const getMember = async (id: number) => {
    try {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error("There was a problem retrieving this member: ", error);
        throw error;
    }
};

/*
export const getAllMembers = async () => {
    try {
        const response = await axios.get(ALL_MEMBERS_API);
        return response.data;
    } catch (error) {
        console.error("There was a problem retrieving members: ", error);
        throw error;
    }
};
*/
/*
export const getSkills = async (id: number) => {
    try {
        const res = await axios.get(`${API_URL_SKILLS}/${id}`);
        return res.data;
    } catch(error) {
        console.error("Error retrieving this member's skills: ", error);
        throw error;
    }
}*/


/*
export const postSkill = async (id: number, skillData: SkillData) =>  {
    try {
        const res = await axios.post(`${API_URL_SKILLS}/${id}`, skillData);
        return res.data;
    } catch(error) {
        console.error("Error in posting skill:", error); // ts wont do anything i bet but whatever
        throw error;
    }
}
*/

/*
export const updateSkill = async (id: number, skillData: SkillData) => {
    const preparedData = {
        id: id,
        skillType: skillData.skillType,
        skillLevel: skillData.skillLevel
    }
    try {
        const res = await axios.put(`${API_URL_SKILLS}/${id}`, preparedData);
        return res.data;
    } catch(error) {
        console.error("Error in updating skills!: ", error);
        throw error;
    }

}
    */


export const updateMember = async (id: number, memberData: MemberData) => {
    try {
        console.log("Sending:", JSON.stringify(memberData, null, 2));
        const response = await axios.patch(`${API_URL}/${id}`, memberData);
        return response.data;
    } catch (error) {
        console.error("Error updating member: ", error);
        throw error;
    }
};


// This should be reworked
export const deleteMember = async (id: number) => {
    try {
        const response = await axios.delete(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting member: ", error);
        throw error;
    }
};



export const getPendingStudents = async () => {
    try {
        const res = await axios.get(`${API_URL+ "registrar/accounts/pending/students"}`);
        return res.data;
    } catch (error) {
        console.error("Error recieving the members that we need: ", error);
        throw error;
    }
}

/*
export const approveUser = async(AR: ApprovalRequest) => {
    try {
        const res = await axios.patch(`${API_MEMBERS_ACCESS + APPROVE_ENDPOINT}`, AR);
        return res.data;
    } catch(error) {
        console.error("ERROR IN POST:",error);
        throw error;
    }
}
*/
/*
export const uploadMemberAor = async (id: number, aorFile: File | any) => {
    const formData = new FormData();
    formData.append('aor',aorFile);
    const response = await axios.post(`${API_URL}/${id}${ASSUMPTION_OF_RISK_ENDPOINT}`, formData, {
      headers: {
        // Remove Content-Type to let browser set it with boundary for multipart/form-data
        'Accept': 'application/json'
      },
      // Note: withCredentials and Authorization will be handled by the interceptor
    });
}*/