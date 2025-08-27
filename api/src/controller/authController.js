import { randomUUID } from "crypto";
export const register = (students)=>async (req, res)=>{
    const {name} = req.body;
    let uuid = req.cookies.studentId;
    if (uuid && students.has(uuid)){
        return res.json({message: "Already Registered", name : students.get(uuid)})
    }
    uuid = randomUUID()
    students.set(uuid, name)
    
}