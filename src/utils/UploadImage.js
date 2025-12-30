import Axios from "./Axios";

/**
 * Upload une image vers le backend et retourne l'URL
 * @param {File} image - Le fichier image sélectionné (provenant d'un input file)
 * @returns {Object} { success: boolean, image_url?: string, message?: string }
 */
const uploadImage = async (image) => {
  // Validation basique du fichier
  if (!image || !(image instanceof File)) {
    return {
      success: false,
      message: "Aucun fichier image valide fourni.",
    };
  }

  // Optionnel : vérifier le type MIME
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
  if (!allowedTypes.includes(image.type)) {
    return {
      success: false,
      message: "Type de fichier non autorisé. Utilisez JPG, PNG, WEBP ou GIF.",
    };
  }

  // Optionnel : limiter la taille (ex: 5 Mo)
  const maxSize = 5 * 1024 * 1024; // 5 Mo
  if (image.size > maxSize) {
    return {
      success: false,
      message: "L'image est trop volumineuse (max 5 Mo).",
    };
  }

  const formData = new FormData();
  formData.append("image", image); // Le nom "image" doit correspondre à upload.single("image") côté backend

  try {
    const response = await Axios({
      url: "/api/images/upload", // Assure-toi que cette route existe côté backend
      method: "POST",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data", // Important pour l'upload de fichier
      },
      // Axios gère automatiquement le boundary pour multipart si on ne touche pas à Content-Type
      // Mais on peut laisser Axios le définir automatiquement → mieux supprimer cette ligne si problème
    });

    // Vérifier si la réponse est positive
    if (response.data && response.data.success) {
      return {
        success: true,
        image_url: response.data.image_url,
        message: response.data.message || "Image uploadée avec succès",
      };
    } else {
      return {
        success: false,
        message: response.data.message || "Échec de l'upload (réponse inattendue)",
      };
    }
  } catch (error) {
    console.error("Erreur lors de l'upload d'image :", error);

    // Gestion détaillée des erreurs
    if (error.response) {
      // Erreur renvoyée par le serveur (ex: 400, 500)
      return {
        success: false,
        message: error.response.data?.message || `Erreur serveur : ${error.response.status}`,
      };
    } else if (error.request) {
      // Pas de réponse du serveur
      return {
        success: false,
        message: "Aucune réponse du serveur. Vérifiez votre connexion.",
      };
    } else {
      // Autre erreur
      return {
        success: false,
        message: "Erreur lors de la préparation de la requête.",
      };
    }
  }
};

export default uploadImage;