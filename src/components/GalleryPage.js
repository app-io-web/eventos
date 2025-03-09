import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  Container, UserBox, PhotoLimitBox, TableBox, InfoBox, MediaGrid, MediaItem, Image, Video, SelectButton, BackButton, SelectedMediaItem 
} from "./GalleryStyles";

const API_URL = process.env.REACT_APP_NOCODB_URL;
const API_TOKEN = process.env.REACT_APP_NOCODB_TOKEN;

const GalleryPage = () => {
  const { tableCode, username } = useParams();
  const navigate = useNavigate();
  const [mesa, setMesa] = useState(null);
  const [limiterPhotos, setLimiterPhotos] = useState(0);
  const [remainingPhotos, setRemainingPhotos] = useState(0);
  const [mediaData, setMediaData] = useState({ Photos: [], GIFs: [], Videos: [] });
  const [selectedMedia, setSelectedMedia] = useState([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [recordId, setRecordId] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);


  useEffect(() => {
    const fetchMediaData = async () => {
      try {
        const tableBaseCode = tableCode.substring(0, tableCode.lastIndexOf("-"));
        const mesaNumber = tableCode.split("-").pop();
  
        const response = await axios.get(`${API_URL}?where=(URI_UNIC,eq,${tableBaseCode})`, {
          headers: {
            "xc-token": API_TOKEN,
            "Content-Type": "application/json",
          },
        });
  
        if (response.data.list.length > 0) {
          const table = response.data.list[0];
  
          setRecordId(table.Id);
          setMesa(mesaNumber);
          
          const limitPhotos = table.Limiter_Photos_Table || 0;
          setLimiterPhotos(limitPhotos);
  
          let mediaInfo = { Photos: [], GIFs: [], Videos: [] };
  
          // 📸 Processar Photos_Uploads
          if (table.Photos_Uploads) {
            try {
              const photosData = typeof table.Photos_Uploads === "string"
                ? JSON.parse(table.Photos_Uploads)
                : table.Photos_Uploads;
  
              mediaInfo.Photos = photosData.flatMap(m =>
                m.Fotos.flatMap(f => f.Fotos.map(photo => ({
                  id: photo.id,
                  url: photo.url
                })))
              );
            } catch (error) {
              console.error("Erro ao processar JSON de `Photos_Uploads`:", error);
            }
          }
  
          // 🎞️ Processar Gif_Uploads
          if (table.Gif_Uploads) {
            try {
              const gifsData = typeof table.Gif_Uploads === "string"
                ? JSON.parse(table.Gif_Uploads)
                : table.Gif_Uploads;
  
                mediaInfo.GIFs = (gifsData || [])
                .flatMap(m => (m.GIFs ? m.GIFs.flatMap(f => (f.Fotos ? f.Fotos.map(gif => ({
                  id: gif.id || Math.random().toString(),
                  url: gif.url
                })) : [])) : []));
              
            } catch (error) {
              console.error("Erro ao processar JSON de `Gif_Uploads`:", error);
            }
          }
  
          // 🎥 Processar Videos_Uploads
          if (table.Videos_Uploads) {
            try {
              const videosData = typeof table.Videos_Uploads === "string"
                ? JSON.parse(table.Videos_Uploads)
                : table.Videos_Uploads;
  
              mediaInfo.Videos = videosData.flatMap(m =>
                m.Videos.flatMap(f => f.Arquivos.map(video => ({
                  id: video.id || Math.random().toString(),
                  url: video.url
                })))
              );
            } catch (error) {
              console.error("Erro ao processar JSON de `Videos_Uploads`:", error);
            }
          }
  
          setMediaData(mediaInfo);
        } else {
          console.error("❌ Nenhum registro encontrado para URI_UNIC:", tableBaseCode);
        }
      } catch (error) {
        console.error("❌ Erro ao buscar os dados da mesa:", error);
      }
    };
  
    fetchMediaData();
  }, [tableCode]);
  
  // 🔥 Atualiza `remainingPhotos` sempre que `mediaData` ou `limiterPhotos` mudar!
  useEffect(() => {
    if (limiterPhotos > 0) {
      const totalMídiasAtuais = mediaData.Photos.length + mediaData.GIFs.length + mediaData.Videos.length;
      const novasFotosRestantes = limiterPhotos - totalMídiasAtuais;
  
      // 🔥 Corrige valores negativos
      setRemainingPhotos(novasFotosRestantes >= 0 ? novasFotosRestantes : 0);
  
      console.log("📸 Total de Mídias Atualizado:", totalMídiasAtuais);
      console.log("📉 Fotos Restantes Atualizadas:", novasFotosRestantes >= 0 ? novasFotosRestantes : 0);
    }
  }, [mediaData, limiterPhotos]); // ✅ Agora depende de `mediaData`
  

  const toggleSelectionMode = () => {
    setIsSelecting(!isSelecting);
    if (!isSelecting) {
      setSelectedMedia([]);
    }
  };

  const toggleMediaSelection = (photo) => {
    if (isSelecting) {
      if (!photo || !photo.id) {
        console.error("🚨 Erro: A mídia selecionada não tem um ID válido!", photo);
        return;
      }

      setSelectedMedia((prevSelected) =>
        prevSelected.includes(photo.id)
          ? prevSelected.filter((item) => item !== photo.id)
          : [...prevSelected, photo.id]
      );
    }
  };

  const handleDeleteMedia = async () => {
    if (selectedMedia.length === 0 || !recordId) return;
  
    try {
      console.log("🟡 Mídias Selecionadas para Deleção:", selectedMedia);
      console.log("📡 ID do Registro:", recordId);
  
      const RECORDS_URL = `${API_URL}`;
  
      // **PEGAR O JSON ATUAL COMPLETO DO NOCODB**
      const response = await axios.get(RECORDS_URL, {
        headers: {
          "xc-token": API_TOKEN,
          "Content-Type": "application/json",
        },
      });
  
      const originalData = response.data.list[0];
      console.log("🔍 JSON Original Completo:", JSON.stringify(originalData, null, 2));
  
      let existingPhotosUploads = originalData.Photos_Uploads || [];
      let existingGifUploads = originalData.Gif_Uploads || [];
      let existingVideoUploads = originalData.Videos_Uploads || [];
  
      // **Filtrar apenas a mídia específica para deletar (Photos)**
      const updatedPhotosUploads = existingPhotosUploads.map((mesaData) => ({
        ...mesaData,
        Fotos: mesaData.Fotos.map((user) => ({
          ...user,
          Fotos: user.Fotos.filter((foto) => !selectedMedia.includes(foto.id)),
        })).filter(user => user.Fotos.length > 0),
      })).filter(mesaData => mesaData.Fotos.length > 0);
  
      // **Filtrar apenas a mídia específica para deletar (GIFs)**
      const updatedGifUploads = existingGifUploads.map((mesaData) => ({
        ...mesaData,
        GIFs: mesaData.GIFs.map((user) => ({
          ...user,
          Fotos: user.Fotos.filter((gif) => !selectedMedia.includes(gif.id)),
        })).filter(user => user.Fotos.length > 0),
      })).filter(mesaData => mesaData.GIFs.length > 0);
  
      // **Filtrar apenas a mídia específica para deletar (Vídeos)**
      const updatedVideoUploads = existingVideoUploads.map((mesaData) => ({
        ...mesaData,
        Videos: mesaData.Videos.map((user) => ({
          ...user,
          Arquivos: user.Arquivos.filter((video) => !selectedMedia.includes(video.id)),
        })).filter(user => user.Arquivos.length > 0),
      })).filter(mesaData => mesaData.Videos.length > 0);
  
      console.log("✅ JSON Atualizado - Photos:", JSON.stringify(updatedPhotosUploads, null, 2));
      console.log("✅ JSON Atualizado - GIFs:", JSON.stringify(updatedGifUploads, null, 2));
      console.log("✅ JSON Atualizado - Vídeos:", JSON.stringify(updatedVideoUploads, null, 2));
  
      // **Criar payload para envio (Agora com Photos, GIFs e Vídeos!)**
      const payload = {
        Id: recordId,
        Photos_Uploads: updatedPhotosUploads.length > 0 ? updatedPhotosUploads : [],
        Gif_Uploads: updatedGifUploads.length > 0 ? updatedGifUploads : [],
        Videos_Uploads: updatedVideoUploads.length > 0 ? updatedVideoUploads : [],
      };
  
      console.log("📡 Enviando payload para NocoDB:", JSON.stringify(payload, null, 2));
  
      const updateResponse = await axios.patch(RECORDS_URL, payload, {
        headers: {
          "xc-token": API_TOKEN,
          "Content-Type": "application/json",
        },
      });
  
      console.log("✅ Resposta do NocoDB:", updateResponse.data);
  
      // **Corrigir a contagem de mídias restantes**
      const totalPhotosNow = updatedPhotosUploads.flatMap(m => m.Fotos.flatMap(u => u.Fotos)).length;
      const totalGifsNow = updatedGifUploads.flatMap(m => m.GIFs.flatMap(u => u.Fotos)).length;
      const totalVideosNow = updatedVideoUploads.flatMap(m => m.Videos.flatMap(u => u.Arquivos)).length;
  
      const totalMídiasAtuais = totalPhotosNow + totalGifsNow + totalVideosNow;
      if (!limiterPhotos || limiterPhotos < 0) {
        console.warn("⚠️ Limite de Fotos inválido na exclusão! Ajustando...");
        setLimiterPhotos(0);
      }
      
      const novasFotosRestantes = limiterPhotos - totalMídiasAtuais;
      
      // 🟡 Debug: Verificando valores antes da exclusão
      console.log("🗑️ Mídias Selecionadas para Deleção:", selectedMedia);
      console.log("📸 Fotos Restantes Antes:", remainingPhotos);
      console.log("📸 Fotos Após Deletar:", totalPhotosNow);
      console.log("🎞️ GIFs Após Deletar:", totalGifsNow);
      console.log("🎥 Vídeos Após Deletar:", totalVideosNow);
      console.log("📉 Fotos Restantes (antes de ajuste):", novasFotosRestantes);
      
      // 🔥 Agora evita contagem errada e mantém 0 se necessário
      setRemainingPhotos(novasFotosRestantes >= 0 ? novasFotosRestantes : 0);
      console.log("✅ Fotos Restantes Atualizadas:", novasFotosRestantes >= 0 ? novasFotosRestantes : 0);
      
  
      setMediaData((prevData) => ({
        ...prevData,
        Photos: prevData.Photos.filter((photo) => !selectedMedia.includes(photo.id)),
        GIFs: prevData.GIFs.filter((gif) => !selectedMedia.includes(gif.id)), 
        Videos: prevData.Videos.filter((video) => !selectedMedia.includes(video.id)), 
      }));
  
      setSelectedMedia([]);
      setIsSelecting(false);
      alert("📌 Mídia removida com sucesso!");
    } catch (error) {
      console.error("❌ Erro ao deletar mídia:", error);
      alert("❌ Erro ao deletar mídia. Tente novamente.");
    }
  };
  
  


  const openModal = (photo) => {
    setSelectedImage(photo.url); // 🔥 Armazena a URL da imagem no estado
  };
  
  const closeModal = () => {
    setSelectedImage(null); // 🔥 Fecha o modal ao redefinir a imagem para null
  };
  

  return (
    <Container>
      <InfoBox>
        <UserBox>👤 {username}</UserBox>
        <PhotoLimitBox>📸 Limite de Fotos: {limiterPhotos}</PhotoLimitBox>
        <PhotoLimitBox>🖼️ Fotos Restantes: {remainingPhotos}</PhotoLimitBox>
        <TableBox>Mesa {mesa}</TableBox>
      </InfoBox>
  
      {selectedMedia.length > 0 && <SelectButton onClick={handleDeleteMedia}>🗑️ Deletar</SelectButton>}
  
      <SelectButton onClick={toggleSelectionMode}>
        {isSelecting ? "Finalizar Seleção" : "Selecionar"}
      </SelectButton>
  
      <MediaGrid>
            {/* 🔥 Exibir Fotos */}
            {mediaData.Photos.map((photo, index) => (
              <MediaItem 
                key={`photo-${index}`} 
                onClick={() => isSelecting ? toggleMediaSelection(photo) : openModal(photo)}
                as={selectedMedia.includes(photo.id) ? SelectedMediaItem : MediaItem} 
              >
                <Image
                  src={photo.url}
                  alt={`Foto ${index + 1}`}
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/150";
                    console.error("Erro ao carregar imagem:", e.target.src);
                  }}
                />
              </MediaItem>
            ))}

            {/* 🔥 Exibir GIFs */}
            {mediaData.GIFs.map((gif, index) => (
              <MediaItem 
                key={`gif-${index}`} 
                onClick={() => isSelecting ? toggleMediaSelection(gif) : openModal(gif)}
                as={selectedMedia.includes(gif.id) ? SelectedMediaItem : MediaItem} 
              >
                <Image
                  src={gif.url}
                  alt={`GIF ${index + 1}`}
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/150";
                    console.error("Erro ao carregar GIF:", e.target.src);
                  }}
                />
              </MediaItem>
            ))}

            {/* 🔥 Exibir Vídeos */}
            {mediaData.Videos.map((video, index) => (
              <MediaItem 
                key={`video-${index}`} 
                onClick={() => isSelecting ? toggleMediaSelection(video) : openModal(video)}
                as={selectedMedia.includes(video.id) ? SelectedMediaItem : MediaItem} 
              >
                <Video controls>
                  <source src={video.url} type="video/mp4" />
                </Video>
              </MediaItem>
            ))}
          </MediaGrid>


  
      {/* 🔥 O Modal de Imagem */}
      {selectedImage && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", 
          background: "rgba(0, 0, 0, 0.8)", display: "flex", alignItems: "center", 
          justifyContent: "center", zIndex: 1000
        }}>
          {/* Botão de Fechar "X" */}
          <button 
            onClick={closeModal} 
            style={{
              position: "absolute", top: "15px", right: "20px", fontSize: "24px", 
              background: "transparent", color: "#fff", border: "none", cursor: "pointer"
            }}
          >
            ❌
          </button>

          <img src={selectedImage} alt="Imagem ampliada" style={{ maxWidth: "90%", maxHeight: "90%", borderRadius: "10px" }} />
        </div>
      )}

  
      <BackButton onClick={() => navigate(`/${tableCode}/home?username=${username}`)}>Voltar</BackButton>
    </Container>
  );
  
};

export default GalleryPage;
