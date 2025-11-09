import React, { useState } from 'react';

// 'onClose' é uma função que receberemos da HomePage
function EventModal({ onClose }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [isEnviado, setIsEnviado] = useState(false);
  
  // (NOVO) Estado para mensagens de erro/sucesso da API
  const [formMessage, setFormMessage] = useState('');

  // --- (ATUALIZADO) AGORA CHAMA A API REAL ---
  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setFormMessage(''); // Limpa mensagens antigas

    try {
      // 1. Chamar a nossa nova API de inscrições
      const response = await fetch('https://instituto-alma-backend-production.up.railway.app', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nome, email }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Se a API der um erro (ex: 400, 409, 500)
        throw new Error(data.message || 'Erro ao enviar inscrição.');
      }

      // 2. SUCESSO!
      setIsEnviado(true);
      setFormMessage(data.message); // "Inscrição realizada com sucesso!"

      // Fecha o modal após 3 segundos
      setTimeout(() => {
        onClose();
      }, 3000);

    } catch (error) {
      console.error('Erro no formulário do modal:', error);
      // Mostra o erro (ex: "Este email já está cadastrado")
      setFormMessage(error.message);
      setIsEnviado(true); // Mostra a mensagem de erro no lugar do sucesso
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        
        <button className="modal-close-btn" onClick={onClose}>&times;</button>
        
        {/* Se NÃO foi enviado, mostre o formulário */}
        {!isEnviado ? (
          <>
            <h2>Seja Notificado!</h2>
            <p>Preencha os seus dados e avisaremos sobre os próximos eventos.</p>
            
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label htmlFor="modal-nome" className="form-label">O seu Nome</label>
                <input
                  type="text"
                  id="modal-nome"
                  className="form-input"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="modal-email" className="form-label">O seu Email</label>
                <input
                  type="email"
                  id="modal-email"
                  className="form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-red" style={{ width: '100%' }}>
                Enviar Inscrição
              </button>
            </form>
          </>
        ) : (
          // Se FOI enviado, mostre a mensagem de sucesso ou erro
          <div className="modal-success">
            {/* O título muda dependendo se deu erro ou não */}
            <h2 style={{ color: formMessage.startsWith('Erro:') ? '#C6421E' : '#81C784' }}>
              {formMessage.startsWith('Erro:') ? 'Erro!' : 'Obrigado!'}
            </h2>
            <p>{formMessage}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default EventModal;