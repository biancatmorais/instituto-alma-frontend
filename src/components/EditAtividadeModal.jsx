import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

// Este modal recebe:
// - atividadeId: O ID da atividade a ser editada
// - onClose: A função para fechar o modal
// - onSave: A função para atualizar a lista na AdminPage
function EditAtividadeModal({ atividadeId, onClose, onSave }) {
  const { token } = useAuth();
  
  // Estados do formulário
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [imagem1, setImagem1] = useState(null);
  const [imagem2, setImagem2] = useState(null);
  const [imagem3, setImagem3] = useState(null);
  const [imagem4, setImagem4] = useState(null);

  // Estados de feedback
  const [isLoading, setIsLoading] = useState(true);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  
  // Imagens antigas (apenas para mostrar o nome)
  const [oldImages, setOldImages] = useState({});

  // 1. Buscar os dados da atividade quando o modal abre
  useEffect(() => {
    const fetchAtividade = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`https://instituto-alma-backend-production.up.railway.app/${atividadeId}`);
        if (!response.ok) throw new Error('Falha ao buscar dados da atividade.');
        
        const data = await response.json();
        // Preenche o formulário com os dados do banco
        setTitulo(data.titulo);
        setDescricao(data.descricao);
        // Guarda os nomes dos ficheiros antigos
        setOldImages({
          img1: data.imagem_url_1,
          img2: data.imagem_url_2,
          img3: data.imagem_url_3,
          img4: data.imagem_url_4,
        });
        
      } catch (err) {
        setFormError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAtividade();
  }, [atividadeId]);


  // 2. Função para enviar a ATUALIZAÇÃO
  const handleUpdateAtividade = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    const formData = new FormData();
    formData.append('titulo', titulo);
    formData.append('descricao', descricao);
    
    // Anexa os ficheiros NOVOS (se o user selecionou algum)
    if (imagem1) formData.append('imagem_1', imagem1);
    if (imagem2) formData.append('imagem_2', imagem2);
    if (imagem3) formData.append('imagem_3', imagem3);
    if (imagem4) formData.append('imagem_4', imagem4);

    try {
      // Chama a rota PUT
      const response = await fetch(`https://instituto-alma-backend-production.up.railway.app/${atividadeId}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Erro ao atualizar atividade');

      setFormSuccess(data.message); // "Atividade atualizada com sucesso."
      
      // Chama a função 'onSave' (que veio da AdminPage)
      // para atualizar a tabela "Atividades Atuais"
      onSave(); 
      
      // Fecha o modal após 2 segundos
      setTimeout(() => {
        onClose();
      }, 2000);

    } catch (err) {
      console.error("Erro ao atualizar atividade:", err);
      setFormError(err.message);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>&times;</button>
        <h2>Editar Atividade</h2>

        {isLoading ? (
          <p>A carregar dados...</p>
        ) : (
          <form onSubmit={handleUpdateAtividade} className="modal-form">
            <div className="form-group">
              <label htmlFor="edit-ativ-titulo" className="form-label">Título da Atividade</label>
              <input type="text" id="edit-ativ-titulo" className="form-input" value={titulo} onChange={(e) => setTitulo(e.target.value)} required />
            </div>
            <div className="form-group">
              <label htmlFor="edit-ativ-desc" className="form-label">Descrição</label>
              <textarea id="edit-ativ-desc" className="form-textarea" style={{ backgroundColor: '#fff', minHeight: '150px' }} value={descricao} onChange={(e) => setDescricao(e.target.value)} required></textarea>
            </div>
            
            <p style={{textAlign: 'center', fontWeight: 600, marginBottom: '15px'}}>
              Atenção: Enviar uma nova imagem irá substituir permanentemente a antiga.
            </p>

            <div className="form-group">
              <label htmlFor="edit-ativ-img1" className="form-label">Imagem 1 (Atual: {oldImages.img1 || 'Nenhuma'})</label>
              <input type="file" id="edit-ativ-img1" className="form-input" onChange={(e) => setImagem1(e.target.files[0])} />
            </div>
            <div className="form-group">
              <label htmlFor="edit-ativ-img2" className="form-label">Imagem 2 (Atual: {oldImages.img2 || 'Nenhuma'})</label>
              <input type="file" id="edit-ativ-img2" className="form-input" onChange={(e) => setImagem2(e.target.files[0])} />
            </div>
            <div className="form-group">
              <label htmlFor="edit-ativ-img3" className="form-label">Imagem 3 (Atual: {oldImages.img3 || 'Nenhuma'})</label>
              <input type="file" id="edit-ativ-img3" className="form-input" onChange={(e) => setImagem3(e.target.files[0])} />
            </div>
            <div className="form-group">
              <label htmlFor="edit-ativ-img4" className="form-label">Imagem 4 (Atual: {oldImages.img4 || 'Nenhuma'})</label>
              <input type="file" id="edit-ativ-img4" className="form-input" onChange={(e) => setImagem4(e.target.files[0])} />
            </div>
            
            {formError && <p style={{ color: 'red', fontWeight: '600', marginBottom: '15px' }}>{formError}</p>}
            {formSuccess && <p style={{ color: 'green', fontWeight: '600', marginBottom: '15px' }}>{formSuccess}</p>}

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Salvar Alterações</button>
          </form>
        )}
      </div>
    </div>
  );
}

export default EditAtividadeModal;