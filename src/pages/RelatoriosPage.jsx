import React, { useState, useEffect, useCallback } from 'react';

// Esta é a página que o botão "Saiba Mais" (Relatórios) abre

function RelatoriosPage() {

  // --- Estados para os Documentos ---
  const [documentos, setDocumentos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- Buscar os dados da API ---
  const fetchDocumentos = useCallback(async () => {
    setIsLoading(true);
    try {
      // Chama a rota PÚBLICA de documentos
      const response = await fetch('https://instituto-alma-backend-production.up.railway.app/api/documentos');
      if (!response.ok) throw new Error('Falha ao buscar documentos.');
      
      const data = await response.json();
      setDocumentos(data);
      setError(null);
    } catch (err) {
      console.error("Erro ao buscar documentos:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // --- Roda a busca quando a página carrega ---
  useEffect(() => {
    fetchDocumentos();
  }, [fetchDocumentos]);

  // --- Função para renderizar a lista ---
  const renderDocumentList = () => {
    if (isLoading) {
      return <div style={{ textAlign: 'center', padding: '20px' }}>A carregar documentos...</div>;
    }
    if (error) {
      return <div style={{ textAlign: 'center', padding: '20px', color: 'red' }}>Erro: {error}</div>;
    }
    if (documentos.length === 0) {
      return <div style={{ textAlign: 'center', padding: '20px' }}>Nenhum documento de transparência publicado.</div>;
    }

    // A URL base do nosso back-end para os ficheiros
    const fileBaseUrl = 'https://instituto-alma-backend-production.up.railway.app/uploads/';

    // Mapeia os dados do banco para os itens da lista
    return documentos.map((doc) => (
      <div className="report-item" key={doc.id}>
        <h3>{doc.titulo}</h3>
        {/* O link agora aponta para o ficheiro no back-end */}
        <a 
          href={fileBaseUrl + doc.arquivo_url} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="btn btn-red"
        >
          Ver PDF
        </a>
      </div>
    ));
  };

  return (
    // O Header é adicionado automaticamente pelo App.js
    <main 
      className="page-wrapper" 
      style={{ 
        backgroundImage: "linear-gradient(rgba(17, 31, 68, 0.7), rgba(17, 31, 68, 0.7)), url('/documentos/paginadoar.JPG')"
      }}
    >
      <div className="page-header">
        <h1>Relatórios e Prestações de Contas</h1>
        <div className="thin-bar" style={{ backgroundColor: '#6efff1' }}></div>
      </div>

      <div className="reports-container">
        <h2>Nossos Documentos:</h2>
        
        <div className="report-list">
          {/* O conteúdo estático foi substituído por esta função */}
          {renderDocumentList()}
        </div>
      </div>
    </main>
  );
}

export default RelatoriosPage;