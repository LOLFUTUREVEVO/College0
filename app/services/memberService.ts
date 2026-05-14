import axios from "axios";
//import { ALL_MEMBERS, API_MEMBERS_ACCESS , MEMBERS_ENDPOINT, SKILLS_ENDPOINT, GET_PENDING_ENDPOINT, APPROVE_ENDPOINT, ASSUMPTION_OF_RISK_ENDPOINT } from "@/.env/VARIABLES"

const API_URL = "http://localhost:8080/";
//const ALL_MEMBERS_API = API_MEMBERS_ACCESS + MEMBERS_ENDPOINT + ALL_MEMBERS;
//const API_URL_SKILLS = API_MEMBERS_ACCESS + SKILLS_ENDPOINT;

export type SkillType = "SHOPBOT" | "PROGRAMMING" | "CAD" | "PRINT3D" | "LASER_CUTTER" | "DRILL_PRESS" | "ILLUSTRATOR"
export type SkillLevel = "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "SUPER_USER";
export type Status = "PENDING" | "APPROVED" | "REJECTED" | "DISABLED";


export interface MemberData {
  center_id?: number | null;
  grade?: number | null;
  // Remove old team number fields - replaced with team objects
  teams?: Team[];
  first_name: string;
  last_name: string;
  role: string;
  phone_number?: string;
  address?: string;
  email: string;
  dob?: string;
  race?: string;
  gender?: string;
  membership_type: string;
  school_id?: number | null;
  other_school_name?: string;
  is_alumni?: boolean;
  opt_in_emails?: boolean;
  has_signed_waiver?: boolean;
  photo_url?: string;
  membership_valid_until?: string;
  creation_date?: string;
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

export interface SkillData {
    skillType: SkillType;
    skillLevel: SkillLevel;
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
            center_id: memberData.center_id || null,
            grade: memberData.grade || null,
            first_name: memberData.first_name,
            last_name: memberData.last_name,
            role: memberData.role,
            phone_number: memberData.phone_number || null,
            address: memberData.address || null,
            email: memberData.email,
            race: memberData.race || null,
            gender: memberData.gender || null,
            membershipType: memberData.membership_type,
            school: memberData.school_id || null,
            otherSchoolName: memberData.other_school_name || null,
            isAlumni: memberData.is_alumni || false,
            recieveEmails: memberData.opt_in_emails || false,
            isWaiverSigned: memberData.has_signed_waiver || false,
            photoUrl: memberData.photo_url || null,
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



export const getPending = async () => {
    try {
        const res = await axios.get(`${API_URL+ "registrar/accounts/pending/all"}`);
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