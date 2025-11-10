import React, { useState, useEffect, useCallback } from 'react'; 
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 
import EditAtividadeModal from '../components/EditAtividadeModal.jsx'; 
import EditDocumentoModal from '../components/EditDocumentoModal.jsx'; 
import EditMetaModal from '../components/EditMetaModal.jsx'; 

function AdminPage() {
  
  const { token } = useAuth(); 

  // --- Estados para Modais ---
  const [isEditAtividadeModalOpen, setIsEditAtividadeModalOpen] = useState(false);
  const [currentAtividadeId, setCurrentAtividadeId] = useState(null);
  const [isEditDocModalOpen, setIsEditDocModalOpen] = useState(false); 
  const [currentDocId, setCurrentDocId] = useState(null); 
  const [isEditMetaModalOpen, setIsEditMetaModalOpen] = useState(false);
  const [currentMetaId, setCurrentMetaId] = useState(null);

  // --- Estados para MENSAGENS (Ouvidoria) ---
  const [mensagens, setMensagens] = useState([]);
  const [isLoadingMensagens, setIsLoadingMensagens] = useState(true);
  const [errorMensagens, setErrorMensagens] = useState(null);

  // --- Estados para EVENTOS ---
  const [eventos, setEventos] = useState([]);
  const [isLoadingEventos, setIsLoadingEventos] = useState(true);
  const [errorEventos, setErrorEventos] = useState(null);
  const [eventoTitulo, setEventoTitulo] = useState('');
  const [eventoDesc, setEventoDesc] = useState('');
  const [eventoData, setEventoData] = useState('');
  const [eventoLocal, setEventoLocal] = useState('');
  const [eventoFormError, setEventoFormError] = useState('');
  const [eventoFormSuccess, setEventoFormSuccess] = useState('');

  // --- Estados para ATIVIDADES ---
  const [atividades, setAtividades] = useState([]); 
  const [isLoadingAtividades, setIsLoadingAtividades] = useState(true);
  const [errorAtividades, setErrorAtividades] = useState(null);
  const [ativTitulo, setAtivTitulo] = useState('');
  const [ativDescricao, setAtivDescricao] = useState('');
  const [imagem1, setImagem1] = useState(null);
  const [imagem2, setImagem2] = useState(null);
  const [imagem3, setImagem3] = useState(null);
  const [imagem4, setImagem4] = useState(null);
  const [ativFormError, setAtivFormError] = useState('');
  const [ativFormSuccess, setAtivFormSuccess] = useState('');

  // --- Estados para DOCUMENTOS ---
  const [documentos, setDocumentos] = useState([]);
  const [isLoadingDocumentos, setIsLoadingDocumentos] = useState(true);
  const [errorDocumentos, setErrorDocumentos] = useState(null);
  const [docTitulo, setDocTitulo] = useState('');
  const [docArquivo, setDocArquivo] = useState(null);
  const [docFormError, setDocFormError] = useState('');
  const [docFormSuccess, setDocFormSuccess] = useState('');
  
  // --- Estados para METAS ---
  const [metas, setMetas] = useState([]);
  const [isLoadingMetas, setIsLoadingMetas] = useState(true);
  const [errorMetas, setErrorMetas] = useState(null);
  const [metaTitulo, setMetaTitulo] = useState('');
  const [metaValor, setMetaValor] = useState('');
  const [metaFormError, setMetaFormError] = useState('');
  const [metaFormSuccess, setMetaFormSuccess] = useState('');

  // --- Estados para INSCRIÇÕES ---
  const [inscricoes, setInscricoes] = useState([]);
  const [isLoadingInscricoes, setIsLoadingInscricoes] = useState(true);
  const [errorInscricoes, setErrorInscricoes] = useState(null);

  // --- Funções de FETCH (Buscar Dados) ---

// --- FETCH MENSAGENS (COM GUARDA DE TOKEN) ---
  const fetchMensagens = useCallback(async () => {
    if (!token) {
        setIsLoadingMensagens(false);
        setErrorMensagens('Token ausente. Não foi possível carregar as mensagens.');
        return;
    }
    setIsLoadingMensagens(true);
    try {
      const response = await fetch('http://localhost:4000/api/ouvidoria', { headers: { 'Authorization': `Bearer ${token}` }});
      if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Falha ao buscar mensagens.');
      }
      setMensagens(await response.json());
      setErrorMensagens(null);
    } catch (err) { setErrorMensagens(err.message); } 
    finally { setIsLoadingMensagens(false); }
  }, [token]);

  const fetchEventos = useCallback(async () => {
    setIsLoadingEventos(true);
    try {
      const response = await fetch('http://localhost:4000/api/eventos');
      if (!response.ok) throw new Error('Falha ao buscar eventos');
      setEventos(await response.json());
      setErrorEventos(null);
    } catch (err) { setErrorEventos(err.message); } 
    finally { setIsLoadingEventos(false); }
  }, []);

  const fetchAtividades = useCallback(async () => {
    setIsLoadingAtividades(true);
    try {
      const response = await fetch('http://localhost:4000/api/atividades');
      if (!response.ok) throw new Error('Falha ao buscar atividades');
      setAtividades(await response.json());
      setErrorAtividades(null);
    } catch (err) { setErrorAtividades(err.message); } 
    finally { setIsLoadingAtividades(false); }
  }, []);

  const fetchDocumentos = useCallback(async () => {
    setIsLoadingDocumentos(true);
    try {
      const response = await fetch('http://localhost:4000/api/documentos');
      if (!response.ok) throw new Error('Falha ao buscar documentos');
      setDocumentos(await response.json());
      setErrorDocumentos(null);
    } catch (err) { setErrorDocumentos(err.message); } 
    finally { setIsLoadingDocumentos(false); }
  }, []);

  const fetchMetas = useCallback(async () => {
    setIsLoadingMetas(true);
    try {
      const response = await fetch('http://localhost:4000/api/metas');
      if (!response.ok) throw new Error('Falha ao buscar metas');
      setMetas(await response.json());
      setErrorMetas(null);
    } catch (err) { setErrorMetas(err.message); } 
    finally { setIsLoadingMetas(false); }
  }, []);

// --- FETCH INSCRIÇÕES (COM GUARDA DE TOKEN) ---
  const fetchInscricoes = useCallback(async () => {
    if (!token) {
        setIsLoadingInscricoes(false);
        setErrorInscricoes('Acesso negado ou token ausente. Faça login novamente.');
        return; 
    }

    setIsLoadingInscricoes(true);
    try {
      const response = await fetch('http://localhost:4000/api/inscricoes', { 
          headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Falha ao buscar inscrições: Erro de servidor.');
      }
      
      setInscricoes(await response.json());
      setErrorInscricoes(null);
    } catch (err) { 
        setErrorInscricoes(err.message); 
    } 
    finally { 
        setIsLoadingInscricoes(false); 
    }
  }, [token]);


  // --- Efeito para buscar TODOS os dados quando a página carrega ---
  useEffect(() => {
    fetchMensagens();
    fetchEventos();
    fetchAtividades(); 
    fetchDocumentos(); 
    fetchMetas();
    fetchInscricoes();
  }, [fetchMensagens, fetchEventos, fetchAtividades, fetchDocumentos, fetchMetas, fetchInscricoes]);


  // -------------------------------------------------------------
  // --- FUNÇÕES DE CONTROLE DE MODAIS (CORRIGIDAS) ---
  // -------------------------------------------------------------

  const handleOpenEditAtividadeModal = (id) => {
    setCurrentAtividadeId(id);
    setIsEditAtividadeModalOpen(true);
  };
  const handleCloseEditAtividadeModal = () => {
    setIsEditAtividadeModalOpen(false);
    setCurrentAtividadeId(null);
    fetchAtividades(); 
  };

  const handleOpenEditDocModal = (id) => {
    setCurrentDocId(id);
    setIsEditDocModalOpen(true);
  };
  const handleCloseEditDocModal = () => {
    setIsEditDocModalOpen(false);
    setCurrentDocId(null);
    fetchDocumentos(); 
  };

  const handleOpenEditMetaModal = (id) => {
    setCurrentMetaId(id);
    setIsEditMetaModalOpen(true);
  };
  const handleCloseEditMetaModal = () => {
    setIsEditMetaModalOpen(false);
    setCurrentMetaId(null);
    fetchMetas();
  };


  // ----------------------------------------------------------------------
  // --- FUNÇÕES DE AÇÃO (Criar/Deletar) ---
  // ----------------------------------------------------------------------
  
  // --- Eventos: Criar ---
  const handleCreateEvento = async (e) => {
    e.preventDefault();
    setEventoFormError('');
    setEventoFormSuccess('');

    if (!token) {
      setEventoFormError('Autenticação inválida.');
      return;
    }

    try {
      const response = await fetch('http://localhost:4000/api/eventos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          titulo: eventoTitulo,
          descricao: eventoDesc,
          data: eventoData,
          local: eventoLocal,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao criar evento.');
      }

      setEventoFormSuccess('Evento criado com sucesso!');
      setEventoTitulo('');
      setEventoDesc('');
      setEventoData('');
      setEventoLocal('');
      fetchEventos();
      
    } catch (error) {
      console.error('Erro ao criar evento:', error.message);
      setEventoFormError(error.message);
    }
  };

  // --- Eventos: Deletar ---
  const handleDeleteEvento = async (eventoId) => {
    if (!window.confirm('Tem certeza que deseja apagar este evento?')) return;
    
    try {
      const response = await fetch(`http://localhost:4000/api/eventos/${eventoId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao apagar evento.');
      }

      fetchEventos();
    } catch (error) {
      alert(`Falha ao apagar evento: ${error.message}`);
      console.error('Erro ao apagar evento:', error);
    }
  };

  // --- Atividades: Criar ---
  const handleCreateAtividade = async (e) => {
    e.preventDefault();
    setAtivFormError('');
    setAtivFormSuccess('');

    if (!ativTitulo || !ativDescricao || !imagem1) {
      setAtivFormError('Preencha Título, Descrição e Imagem 1.');
      return;
    }

    const formData = new FormData();
    formData.append('titulo', ativTitulo);
    formData.append('descricao', ativDescricao);
    
    if (imagem1) formData.append('images', imagem1);
    if (imagem2) formData.append('images', imagem2);
    if (imagem3) formData.append('images', imagem3);
    if (imagem4) formData.append('images', imagem4);

    try {
      const response = await fetch('http://localhost:4000/api/atividades', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao criar atividade.');
      }

      setAtivFormSuccess('Atividade criada com sucesso!');
      setAtivTitulo('');
      setAtivDescricao('');
      setImagem1(null);
      setImagem2(null);
      setImagem3(null);
      setImagem4(null);
      e.target.reset();
      fetchAtividades();
    } catch (error) {
      console.error('Erro ao criar atividade:', error.message);
      setAtivFormError(error.message);
    }
  };

  // --- Atividades: Deletar ---
  const handleDeleteAtividade = async (atividadeId) => {
    if (!window.confirm('Tem certeza que deseja apagar esta atividade?')) return;
    
    try {
      const response = await fetch(`http://localhost:4000/api/atividades/${atividadeId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao apagar atividade.');
      }

      fetchAtividades();
    } catch (error) {
      alert(`Falha ao apagar atividade: ${error.message}`);
      console.error('Erro ao apagar atividade:', error);
    }
  };

  // --- Documentos: Criar ---
  const handleCreateDocumento = async (e) => {
    e.preventDefault();
    setDocFormError('');
    setDocFormSuccess('');

    if (!docTitulo || !docArquivo) {
      setDocFormError('Preencha Título e selecione o Ficheiro PDF.');
      return;
    }

    const formData = new FormData();
    formData.append('titulo', docTitulo);
    formData.append('arquivo', docArquivo);

    try {
      const response = await fetch('http://localhost:4000/api/documentos', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao criar documento.');
      }

      setDocFormSuccess('Documento criado com sucesso!');
      setDocTitulo('');
      setDocArquivo(null);
      e.target.reset();
      fetchDocumentos();
    } catch (error) {
      console.error('Erro ao criar documento:', error.message);
      setDocFormError(error.message);
    }
  };

  // --- Documentos: Deletar ---
  const handleDeleteDocumento = async (docId) => {
    if (!window.confirm('Tem certeza que deseja apagar este documento?')) return;

    try {
      const response = await fetch(`http://localhost:4000/api/documentos/${docId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao apagar documento.');
      }

      fetchDocumentos();
    } catch (error) {
      alert(`Falha ao apagar documento: ${error.message}`);
      console.error('Erro ao apagar documento:', error);
    }
  };

  // --- Metas: Criar ---
  const handleCreateMeta = async (e) => {
    e.preventDefault();
    setMetaFormError('');
    setMetaFormSuccess('');

    const valorNumerico = parseFloat(metaValor);
    if (isNaN(valorNumerico) || valorNumerico <= 0) {
      setMetaFormError('O valor da meta deve ser um número positivo.');
      return;
    }

    try {
      const response = await fetch('http://localhost:4000/api/metas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          titulo: metaTitulo,
          valor_meta: valorNumerico,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao criar meta.');
      }

      setMetaFormSuccess('Meta criada com sucesso!');
      setMetaTitulo('');
      setMetaValor('');
      fetchMetas();
      
    } catch (error) {
      console.error('Erro ao criar meta:', error.message);
      setMetaFormError(error.message);
    }
  };

  // --- Metas: Deletar ---
  const handleDeleteMeta = async (metaId) => {
    if (!window.confirm('Tem certeza que deseja apagar esta meta?')) return;
    
    try {
      const response = await fetch(`http://localhost:4000/api/metas/${metaId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao apagar meta.');
      }

      fetchMetas();
    } catch (error) {
      alert(`Falha ao apagar meta: ${error.message}`);
      console.error('Erro ao apagar meta:', error);
    }
  };


  // --- Funções de Renderização (Estão corretas e foram mantidas) ---
  
  const renderMensagensContent = () => {
    if (isLoadingMensagens) return <tr><td colSpan="3" style={{ textAlign: 'center' }}>A carregar...</td></tr>;
    if (errorMensagens) return <tr><td colSpan="3" style={{ textAlign: 'center', color: 'red' }}>{errorMensagens}</td></tr>;
    if (mensagens.length === 0) return <tr><td colSpan="3" style={{ textAlign: 'center' }}>Nenhuma mensagem.</td></tr>;
    return mensagens.map((msg) => (
      <tr key={msg.id}>
        <td>{msg.nome} ({msg.email})</td>
        <td>{msg.mensagem}</td>
        <td>{msg.data_formatada}</td>
      </tr>
    ));
  };

  const renderEventosContent = () => {
    if (isLoadingEventos) return <tr><td colSpan="4" style={{ textAlign: 'center' }}>A carregar...</td></tr>;
    if (errorEventos) return <tr><td colSpan="4" style={{ textAlign: 'center', color: 'red' }}>{errorEventos}</td></tr>;
    if (eventos.length === 0) return <tr><td colSpan="4" style={{ textAlign: 'center' }}>Nenhum evento.</td></tr>;
    return eventos.map((evento) => (
      <tr key={evento.id}>
        <td>{evento.titulo}</td>
        <td>{evento.data_formatada}</td>
        <td>{evento.local}</td>
        <td>
          <button onClick={() => handleDeleteEvento(evento.id)} className="btn btn-red" style={{ padding: '5px 10px', fontSize: '12px' }}>
            Apagar
          </button>
        </td>
        
      </tr>
    ));
  };

  const renderAtividadesContent = () => {
    if (isLoadingAtividades) return <tr><td colSpan="3" style={{ textAlign: 'center' }}>A carregar...</td></tr>;
    if (errorAtividades) return <tr><td colSpan="3" style={{ textAlign: 'center', color: 'red' }}>{errorAtividades}</td></tr>;
    if (atividades.length === 0) return <tr><td colSpan="3" style={{ textAlign: 'center' }}>Nenhuma atividade.</td></tr>;
    return atividades.map((ativ) => (
      <tr key={ativ.id}>
        <td>{ativ.titulo}</td>
        <td>{ativ.descricao.substring(0, 50)}...</td>
        <td style={{ display: 'flex', gap: '5px' }}>
          <button 
            onClick={() => handleOpenEditAtividadeModal(ativ.id)} 
            className="btn btn-secondary" 
            style={{ padding: '5px 10px', fontSize: '12px', color: '#111F44', backgroundColor: '#fff', borderColor: '#111F44' }}
          >
            Editar
          </button>
          <button 
            onClick={() => handleDeleteAtividade(ativ.id)} 
            className="btn btn-red" 
            style={{ padding: '5px 10px', fontSize: '12px' }}
          >
            Apagar
          </button>
        </td>
      </tr>
    ));
  };

  const renderDocumentosContent = () => {
    if (isLoadingDocumentos) return <tr><td colSpan="3" style={{ textAlign: 'center' }}>A carregar...</td></tr>;
    if (errorDocumentos) return <tr><td colSpan="3" style={{ textAlign: 'center', color: 'red' }}>{errorDocumentos}</td></tr>;
    if (documentos.length === 0) return <tr><td colSpan="3" style={{ textAlign: 'center' }}>Nenhum documento.</td></tr>;
    return documentos.map((doc) => (
      <tr key={doc.id}>
        <td>{doc.titulo}</td>
        <td>
          <a href={`http://localhost:4000/uploads/${doc.arquivo_url}`} target="_blank" rel="noopener noreferrer">
            Ver PDF
          </a>
        </td>
        <td style={{ display: 'flex', gap: '5px' }}>
          <button 
            onClick={() => handleOpenEditDocModal(doc.id)} 
            className="btn btn-secondary" 
            style={{ padding: '5px 10px', fontSize: '12px', color: '#111F44', backgroundColor: '#fff', borderColor: '#111F44' }}
          >
            Editar
          </button>
          <button 
            onClick={() => handleDeleteDocumento(doc.id)} 
            className="btn btn-red" 
            style={{ padding: '5px 10px', fontSize: '12px' }}
          >
            Apagar
          </button>
        </td>
      </tr>
    ));
  };

  const renderMetasContent = () => {
    if (isLoadingMetas) return <tr><td colSpan="3" style={{ textAlign: 'center' }}>A carregar...</td></tr>;
    if (errorMetas) return <tr><td colSpan="3" style={{ textAlign: 'center', color: 'red' }}>{errorMetas}</td></tr>;
    if (metas.length === 0) return <tr><td colSpan="3" style={{ textAlign: 'center' }}>Nenhuma meta.</td></tr>;
    return metas.map((meta) => {
      const porcentagem = meta.valor_meta > 0 ? (meta.valor_atual / meta.valor_meta) * 100 : 0;
      return (
        <tr key={meta.id}>
          <td>{meta.titulo}</td>
          <td>
            <div className="progress-bar" style={{ margin: 0 }}>
              <div 
                className="progress-fill" 
                style={{ width: `${Math.min(porcentagem, 100)}%` }}
              ></div>
            </div>
            <div className="goal-labels" style={{ marginTop: '5px' }}>
              <span className="current-amount">R$ {meta.valor_atual}</span>
              <span className="goal-amount">Meta: R$ {meta.valor_meta}</span>
            </div>
          </td>
          <td style={{ display: 'flex', gap: '5px' }}>
            <button 
              onClick={() => handleOpenEditMetaModal(meta.id)} 
              className="btn btn-secondary" 
              style={{ padding: '5px 10px', fontSize: '12px', color: '#111F44', backgroundColor: '#fff', borderColor: '#111F44' }}
            >
              Editar
            </button>
            <button 
              onClick={() => handleDeleteMeta(meta.id)} 
              className="btn btn-red" 
              style={{ padding: '5px 10px', fontSize: '12px' }}
            >
              Apagar
            </button>
          </td>
        </tr>
      );
    });
  };

  const renderInscricoesContent = () => {
    if (isLoadingInscricoes) return <tr><td colSpan="3" style={{ textAlign: 'center' }}>A carregar...</td></tr>;
    if (errorInscricoes) return <tr><td colSpan="3" style={{ textAlign: 'center', color: 'red' }}>{errorInscricoes}</td></tr>;
    if (inscricoes.length === 0) return <tr><td colSpan="3" style={{ textAlign: 'center' }}>Ninguém se inscreveu ainda.</td></tr>;
    return inscricoes.map((insc) => (
      <tr key={insc.id}>
        <td>{insc.nome}</td>
        <td>{insc.email}</td>
        <td>{insc.data_formatada}</td>
      </tr>
    ));
  };


  // --- JSX (O que aparece na tela) ---
  return (
    <>
      <main className="admin-dashboard-wrapper">
        <div className="admin-dashboard-header">
          <h1>Painel de Administração</h1>
        </div>
        <div className="admin-dashboard-container">
          <div className="admin-col-left">
            
            {/* Card de CRIAR ATIVIDADE */}
            <div className="admin-card">
              <h2>Adicionar Nova Atividade (Carrossel)</h2>
              {atividades.length >= 4 ? (
                <div style={{ padding: '20px', backgroundColor: '#f0f4f8', borderRadius: '8px', textAlign: 'center' }}>
                  <h3 style={{ color: '#C6421E', marginBottom: '10px' }}>Limite Atingido</h3>
                  <p>O carrossel suporta no máximo 4 atividades. Exclua uma antiga para adicionar uma nova.</p>
                </div>
              ) : (
                <form onSubmit={handleCreateAtividade}>
                  <div className="form-group">
                    <label htmlFor="ativ-titulo" className="form-label">Título da Atividade</label>
                    <input type="text" id="ativ-titulo" className="form-input" value={ativTitulo} onChange={(e) => setAtivTitulo(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="ativ-desc" className="form-label">Descrição</label>
                    <textarea id="ativ-desc" className="form-textarea" style={{ backgroundColor: '#fff' }} value={ativDescricao} onChange={(e) => setAtivDescricao(e.target.value)} required></textarea>
                  </div>
                  <div className="form-group">
                    <label htmlFor="ativ-img1" className="form-label">Imagem 1 (Obrigatória)</label>
                    <input type="file" id="ativ-img1" className="form-input" onChange={(e) => setImagem1(e.target.files[0])} required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="ativ-img2" className="form-label">Imagem 2</label>
                    <input type="file" id="ativ-img2" className="form-input" onChange={(e) => setImagem2(e.target.files[0])} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="ativ-img3" className="form-label">Imagem 3</label>
                    <input type="file" id="ativ-img3" className="form-input" onChange={(e) => setImagem3(e.target.files[0])} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="ativ-img4" className="form-label">Imagem 4</label>
                    <input type="file" id="ativ-img4" className="form-input" onChange={(e) => setImagem4(e.target.files[0])} />
                  </div>
                  {ativFormError && <p style={{ color: 'red', fontWeight: '600', marginBottom: '15px' }}>{ativFormError}</p>}
                  {ativFormSuccess && <p style={{ color: 'green', fontWeight: '600', marginBottom: '15px' }}>{ativFormSuccess}</p>}
                  <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Salvar Nova Atividade</button>
                </form>
              )}
            </div>

            {/* Card de CRIAR DOCUMENTO */}
            <div className="admin-card">
              <h2>Adicionar Documento (Transparência)</h2>
              {documentos.length >= 4 ? (
                <div style={{ padding: '20px', backgroundColor: '#f0f4f8', borderRadius: '8px', textAlign: 'center' }}>
                  <h3 style={{ color: '#C6421E', marginBottom: '10px' }}>Limite Atingido</h3>
                  <p>A secção suporta no máximo 4 documentos. Exclua um antigo para adicionar um novo.</p>
                </div>
              ) : (
                <form onSubmit={handleCreateDocumento}>
                  <div className="form-group">
                    <label htmlFor="doc-titulo" className="form-label">Título do Documento</label>
                    <input type="text" id="doc-titulo" className="form-input" value={docTitulo} onChange={(e) => setDocTitulo(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="doc-arquivo" className="form-label">Ficheiro PDF (Obrigatório)</label>
                    <input type="file" id="doc-arquivo" className="form-input" accept=".pdf" onChange={(e) => setDocArquivo(e.target.files[0])} required />
                  </div>
                  {docFormError && <p style={{ color: 'red', fontWeight: '600', marginBottom: '15px' }}>{docFormError}</p>}
                  {docFormSuccess && <p style={{ color: 'green', fontWeight: '600', marginBottom: '15px' }}>{docFormSuccess}</p>}
                  <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Salvar Novo Documento</button>
                </form>
              )}
            </div>

            {/* Card de CRIAR META */}
            <div className="admin-card">
              <h2>Adicionar Nova Meta de Arrecadação</h2>
              {metas.length >= 4 ? ( 
                <div style={{ padding: '20px', backgroundColor: '#f0f4f8', borderRadius: '8px', textAlign: 'center' }}>
                  <h3 style={{ color: '#C6421E', marginBottom: '10px' }}>Limite Atingido</h3>
                  <p>O painel suporta no máximo 4 metas. Exclua uma antiga para adicionar uma nova.</p>
                </div>
              ) : (
                <form onSubmit={handleCreateMeta}>
                  <div className="form-group">
                    <label htmlFor="meta-titulo" className="form-label">Título da Meta (Ex: Ação de Natal)</label>
                    <input type="text" id="meta-titulo" className="form-input" value={metaTitulo} onChange={(e) => setMetaTitulo(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="meta-valor" className="form-label">Valor da Meta (Ex: 10000.00)</label>
                    <input type="number" step="0.01" id="meta-valor" className="form-input" value={metaValor} onChange={(e) => setMetaValor(e.target.value)} required />
                  </div>
                  
                  {metaFormError && <p style={{ color: 'red', fontWeight: '600', marginBottom: '15px' }}>{metaFormError}</p>}
                  {metaFormSuccess && <p style={{ color: 'green', fontWeight: '600', marginBottom: '15px' }}>{metaFormSuccess}</p>}

                  <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Salvar Nova Meta</button>
                </form>
              )}
            </div>

            {/* Card de CRIAR EVENTO */}
            <div className="admin-card">
              <h2>Adicionar Novo Evento</h2>
              <form onSubmit={handleCreateEvento}>
                <div className="form-group">
                  <label htmlFor="evento-titulo" className="form-label">Título</label>
                  <input type="text" id="evento-titulo" className="form-input" value={eventoTitulo} onChange={(e) => setEventoTitulo(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label htmlFor="evento-data" className="form-label">Data (AAAA-MM-DD)</label>
                  <input type="date" id="evento-data" className="form-input" value={eventoData} onChange={(e) => setEventoData(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label htmlFor="evento-local" className="form-label">Local</label>
                  <input type="text" id="evento-local" className="form-input" value={eventoLocal} onChange={(e) => setEventoLocal(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label htmlFor="evento-desc" className="form-label">Descrição (para notificação)</label>
                  <textarea id="evento-desc" className="form-textarea" style={{ backgroundColor: '#fff' }} value={eventoDesc} onChange={(e) => setEventoDesc(e.target.value)} required></textarea>
                </div>
                
                {eventoFormError && <p style={{ color: 'red', fontWeight: '600', marginBottom: '15px' }}>{eventoFormError}</p>}
                {eventoFormSuccess && <p style={{ color: 'green', fontWeight: '600', marginBottom: '15px' }}>{eventoFormSuccess}</p>}

                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Salvar Novo Evento</button>
              </form>
            </div>
          </div>

          {/* --- COLUNA DA DIREITA (Listas) --- */}
          <div className="admin-col-right">
            
            {/* Card de LISTAR METAS */}
            <div className="admin-card">
              <h2>Metas de Arrecadação Atuais</h2>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Título</th>
                    <th>Progresso</th>
                    <th>Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {renderMetasContent()}
                </tbody>
              </table>
            </div>

            {/* Card de LISTAR DOCUMENTOS */}
            <div className="admin-card">
              <h2>Documentos Atuais (Transparência)</h2>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Título</th>
                    <th>Ver</th>
                    <th>Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {renderDocumentosContent()}
                </tbody>
              </table>
            </div>
            
            {/* Card de LISTAR ATIVIDADES */}
            <div className="admin-card">
              <h2>Atividades Atuais (Carrossel)</h2>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Título</th>
                    <th>Descrição (Início)</th>
                    <th>Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {renderAtividadesContent()}
                </tbody>
              </table>
            </div>

            {/* Card de LISTAR EVENTOS */}
            <div className="admin-card">
              <h2>Eventos Atuais</h2>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Evento</th>
                    <th>Data</th>
                    <th>Local</th>
                    <th>Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {renderEventosContent()}
                </tbody>
              </table>
            </div>

            {/* Card de LISTAR MENSAGENS */}
            <div className="admin-card">
              <h2>Mensagens da Ouvidoria</h2>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>De</th>
                    <th>Mensagem</th>
                    <th>Data</th>
                  </tr>
                </thead>
                <tbody>
                  {renderMensagensContent()}
                </tbody>
              </table>
            </div>

            {/* Card de LISTAR INSCRIÇÕES */}
            <div className="admin-card">
              <h2>Possíveis Participantes (Notificações)</h2>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Email</th>
                    <th>Data de Inscrição</th>
                  </tr>
                </thead>
                <tbody>
                  {renderInscricoesContent()}
                </tbody>
              </table>
            </div>
            
            {/* Card de Doações (Estático) */}
            <div className="admin-card">
              <h2>Acompanhar Doações</h2>
              <table className="admin-table">
                <tbody><tr><td>(Dados de doação virão aqui)</td><td>R$ 50,00</td></tr></tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* RENDERIZAÇÃO DOS MODAIS (Pop-ups) */}
      {isEditAtividadeModalOpen && (
        <EditAtividadeModal 
          atividadeId={currentAtividadeId} 
          onClose={handleCloseEditAtividadeModal}
          onSave={fetchAtividades} 
        />
      )}
      
      {isEditDocModalOpen && (
        <EditDocumentoModal
          documentoId={currentDocId}
          onClose={handleCloseEditDocModal}
          onSave={fetchDocumentos} 
        />
      )}
      
      {isEditMetaModalOpen && (
        <EditMetaModal
          metaId={currentMetaId}
          onClose={handleCloseEditMetaModal}
          onSave={fetchMetas}
        />
      )}
    </>
  );
}

export default AdminPage;