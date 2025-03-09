import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid'; // Importar para gerar UUID único
import axios from 'axios';
import { 
  Container, UploadBox, UploadImage, HiddenInput, ButtonProcess, Background, Title, ButtonGallery, FileList, FileItem
} from './HomeStyles';
import uploadIcon from "../assets/upload.png";

const API_URL = process.env.REACT_APP_NOCODB_URL;
const STORAGE_URL = `${API_URL.replace('/tables/mk5ja4oi9longc3/records', '')}/storage/upload`;
const RECORDS_URL = process.env.REACT_APP_NOCODB_URL;
const API_TOKEN = process.env.REACT_APP_NOCODB_TOKEN;
const VIEWER_URL = process.env.REACT_APP_NOCODB_URL_VIEWER;

const HomePage = () => {
  const { tableCode } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // ✅ Pegando nome do usuário corretamente da URL
  const params = new URLSearchParams(location.search);
  const usernameFromURL = params.get('username');

  // ✅ Estado do nome de usuário preenchido automaticamente
  const [username, setUsername] = useState(usernameFromURL || '');

  const [files, setFiles] = useState([]);
  const [limiterPhotos, setLimiterPhotos] = useState(0);
  const [mesa, setMesa] = useState(null);
  const [recordId, setRecordId] = useState(null);
  const [existingPhotosUploads, setExistingPhotosUploads] = useState([]);
  const [existingGifUploads, setExistingGifUploads] = useState([]);
  const [existingVideoUploads, setExistingVideoUploads] = useState([]);


  // 🚀 Se não tem usuário na URL, joga pro início
  useEffect(() => {
    if (!usernameFromURL) {
      alert('Erro: Nome do usuário não encontrado!');
      navigate('/');
    }
  }, [usernameFromURL, navigate]);



  useEffect(() => {
    const fetchTableData = async () => {
      try {
        const tableBaseCode = tableCode.substring(0, tableCode.lastIndexOf('-'));
        const mesaNumber = tableCode.split('-').pop();

        const response = await axios.get(`${RECORDS_URL}?where=(URI_UNIC,eq,${tableBaseCode})`, {
          headers: {
            'xc-token': API_TOKEN,
            'Content-Type': 'application/json'
          }
        });

        if (response.data.list.length > 0) {
          const table = response.data.list[0];

          setMesa(mesaNumber);
          setLimiterPhotos(table.Limiter_Photos_Table || 0);
          setRecordId(table.Id);

          console.log('✅ Registro encontrado:', table);

          if (table.Photos_Uploads) {
            try {
              setExistingPhotosUploads(
                typeof table.Photos_Uploads === 'string'
                  ? JSON.parse(table.Photos_Uploads)
                  : table.Photos_Uploads
              );
            } catch (error) {
              console.error("Erro ao processar JSON de `Photos_Uploads`:", error);
            }
          }

          if (table.Gif_Uploads) {
            try {
              setExistingGifUploads(
                typeof table.Gif_Uploads === 'string'
                  ? JSON.parse(table.Gif_Uploads)
                  : table.Gif_Uploads
              );
            } catch (error) {
              console.error("Erro ao processar JSON de `Gif_Uploads`:", error);
            }
          }

          if (table.Videos_Uploads) {
            try {
              setExistingVideoUploads(
                typeof table.Videos_Uploads === 'string'
                  ? JSON.parse(table.Videos_Uploads)
                  : table.Videos_Uploads
              );
            } catch (error) {
              console.error("Erro ao processar JSON de `Videos_Uploads`:", error);
            }
          }
        } else {
          console.error('❌ Nenhum registro encontrado para URI_UNIC:', tableBaseCode);
        }
      } catch (error) {
        console.error('❌ Erro ao buscar os dados da mesa:', error);
      }
    };

    fetchTableData();
  }, [tableCode]);

  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  }

const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || files.length === 0) {
        alert('Preencha o nome e selecione os arquivos!');
        return;
    }

    if (!recordId) {
        alert('Erro: Nenhum ID de registro encontrado.');
        console.error('❌ Erro: ID do registro está null.');
        return;
    }

    // 🔍 **Verificar se a mesa já atingiu o limite de mídias**
    let mesaIndex = existingPhotosUploads.findIndex((sec) => sec.mesa === mesa);
    let totalMidiasNaMesa = 0;

    // ✅ Contabiliza apenas fotos não vazias
    if (mesaIndex !== -1) {
        totalMidiasNaMesa += existingPhotosUploads[mesaIndex].Fotos.reduce((acc, user) => {
            return acc + user.Fotos.filter(foto => Object.keys(foto).length > 0).length;
        }, 0);
    }

    // ✅ Contabiliza apenas GIFs e vídeos que tenham conteúdo
    totalMidiasNaMesa += existingGifUploads?.filter(gif => gif.GIFs?.some(g => g.Fotos?.length > 0))?.length || 0;
    totalMidiasNaMesa += existingVideoUploads?.filter(video => video.Videos?.some(v => v.Arquivos?.length > 0))?.length || 0;
    
    // 🔥 **Bloquear upload se ultrapassar o limite**
    if (totalMidiasNaMesa + files.length > limiterPhotos) {
        alert(`⚠️ O limite de mídias para esta mesa é ${limiterPhotos}. Você já tem ${totalMidiasNaMesa} arquivos e está tentando adicionar ${files.length}. Reduza a seleção!`);
        return;
    }

    try {
        const uploadPromises = files.map(async (file) => {
            const formData = new FormData();
            formData.append('file', file);

            console.log('📤 Enviando arquivo:', file.name);

            const uploadResponse = await axios.post(
                STORAGE_URL,
                formData,
                {
                    headers: {
                        'xc-token': API_TOKEN,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            console.log('✅ Resposta do Upload:', uploadResponse.data);

            return {
                id: uuidv4(), // ✅ Adiciona um ID único para cada mídia
                url: `${VIEWER_URL}${uploadResponse.data[0].path}`,
                type: file.type.includes('gif') ? 'gif' : file.type.includes('video') ? 'video' : 'photo'
            };
        });

        const uploadedFiles = await Promise.all(uploadPromises);

        const photos = uploadedFiles.filter(file => file.type === 'photo');
        const gifs = uploadedFiles.filter(file => file.type === 'gif');
        const videos = uploadedFiles.filter(file => file.type === 'video');

        let updatedPhotosUploads = [...existingPhotosUploads];
        let updatedGifUploads = [...existingGifUploads];
        let updatedVideoUploads = [...existingVideoUploads];

        if (mesaIndex !== -1) {
            let userIndex = updatedPhotosUploads[mesaIndex].Fotos.findIndex((user) => user.Usuario === username);

            if (userIndex !== -1) {
                photos.forEach((photo, index) => {
                    updatedPhotosUploads[mesaIndex].Fotos[userIndex].Fotos.push({ id: photo.id, url: photo.url });
                });
            } else {
                updatedPhotosUploads[mesaIndex].Fotos.push({
                    Usuario: username,
                    Fotos: photos.map((photo) => ({ id: photo.id, url: photo.url }))
                });
            }
        } else {
            updatedPhotosUploads.push({
                mesa: mesa,
                "Limite Mesa": limiterPhotos,
                Fotos: [{
                    Usuario: username,
                    Fotos: photos.map((photo) => ({ id: photo.id, url: photo.url }))
                }]
            });
        }

        // ✅ Apenas adiciona GIFs e vídeos se houver conteúdo
        if (gifs.length > 0) {
            updatedGifUploads.push({
                mesa: mesa,
                "Limite Mesa": limiterPhotos,
                GIFs: [{
                    Usuario: username,
                    Fotos: gifs.map((gif) => ({ id: gif.id, url: gif.url }))
                }]
            });
        }

        if (videos.length > 0) {
            updatedVideoUploads.push({
                mesa: mesa,
                "Limite Mesa": limiterPhotos,
                Videos: [{
                    Usuario: username,
                    Arquivos: videos.map((video) => ({ id: video.id, url: video.url }))
                }]
            });
        }

        const payload = {
            Id: recordId,
            Photos_Uploads: JSON.stringify(updatedPhotosUploads),
            Gif_Uploads: JSON.stringify(updatedGifUploads),
            Videos_Uploads: JSON.stringify(updatedVideoUploads)
        };

        console.log('📡 Enviando payload:', JSON.stringify(payload, null, 2));

        await axios.patch(RECORDS_URL, payload, {
            headers: {
                'xc-token': API_TOKEN,
                'Content-Type': 'application/json'
            }
        });

        alert('✅ Upload realizado com sucesso!');
        navigate(`/gallery/${tableCode}/${username}`);
        setFiles([]);
        setUsername('');
    } catch (error) {
        console.error('❌ Erro no upload:', error);
        alert('Erro ao enviar os dados!');
    }
};




return (
  <Container>
    <Title>My Event - Mesa {mesa}</Title>

    {/* ✅ Área de Upload que abre o seletor de arquivos */}
    <UploadBox onClick={handleUploadClick}>
      <Background />
      <UploadImage src={require("../assets/upload.png")} alt="Upload" width={192} height={192} />
      <HiddenInput 
        type="file" 
        accept="image/*, video/*, .gif" 
        multiple 
        ref={fileInputRef} 
        onChange={handleFileChange} 
      />
    </UploadBox>

    {/* ✅ Exibir os arquivos selecionados */}
    {files.length > 0 && (
      <FileList>
        {files.map((file, index) => (
          <FileItem key={index}>{file.name}</FileItem>
        ))}
      </FileList>
    )}

    {/* ✅ Botão de Processar */}
    {/* ✅ Botão de Processar agora chama `handleSubmit` */}
    <ButtonProcess onClick={handleSubmit}>Processar</ButtonProcess>


    {/* ✅ O botão "Acessar Galeria" agora aparece apenas se houver uploads */}
    {existingPhotosUploads.length > 0 && (
      <ButtonGallery onClick={() => navigate(`/gallery/${tableCode}/${username}`)}>
        Acessar Galeria
      </ButtonGallery>
    )}
  </Container>
);
};

export default HomePage;
