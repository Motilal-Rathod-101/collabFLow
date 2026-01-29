import api  from "./axios";

const getComments = async()=>{
    const res = await api.get("comments");
    return res.data;
}

export default getComments;
