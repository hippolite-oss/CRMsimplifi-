// services/fetchUserDetails.js
import Axios from "./Axios";

const fetchUserDetails = async () => {
  try {
    const response = await Axios.get('/api/users/me');

    if (response.data?.success) {
      return response.data.data; // ← on retourne directement l'utilisateur
    } else {
      throw new Error(response.data?.message || "Erreur récupération utilisateur");
    }

  } catch (error) {
    console.error("❌ fetchUserDetails error:", error);
    return null;
  }
};

export default fetchUserDetails;
