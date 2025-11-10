import React, { useState, useEffect, useCallback } from 'react'; 
import { Link } from 'react-router-dom'; 
import EventModal from '../components/EventModal'; 

function HomePage() {

  // --- LÓGICA DO CARROSSEL ---
  const [activeSlide, setActiveSlide] = useState(0); 
  
  // (CORREÇÃO) Adicionando o slidesData de volta para o fallback
  const slidesData = [
    { id: 0, barColor: '#f06678' },
    { id: 1, barColor: '#ffc9fc' },
    { id: 2, barColor: '#64B5F6' },
    { id: 3, barColor: '#6efff1' },
  ];

  // --- LÓGICA DO MODAL (EVENTOS) ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // --- LÓGICA DO FORMULÁRIO DA OUVIDORIA ---
  const [ouvidoriaNome, setOuvidoriaNome] = useState('');
  const [ouvidoriaEmail, setOuvidoriaEmail] = useState('');
  const [ouvidoriaTelefone, setOuvidoriaTelefone] = useState('');
  const [ouvidoriaMensagem, setOuvidoriaMensagem] = useState('');
  const [formStatus, setFormStatus] = useState(''); 

  // --- ESTADOS PARA OS DADOS DA API ---
  const [eventos, setEventos] = useState([]);
  const [isLoadingEventos, setIsLoadingEventos] = useState(true);
  const [errorEventos, setErrorEventos] = useState(null);
  
  const [atividades, setAtividades] = useState([]); 
  const [isLoadingAtividades, setIsLoadingAtividades] = useState(true);
  const [errorAtividades, setErrorAtividades] = useState(null);

  // --- Funções de FETCH (com useCallback) ---
  const fetchEventos = useCallback(async () => {
    setIsLoadingEventos(true);
    try {
      const response = await fetch('http://localhost:4000/api/eventos'); 
      if (!response.ok) throw new Error('Falha ao buscar eventos do servidor');
      const data = await response.json();
      setEventos(data); 
      setErrorEventos(null);
    } catch (err) {
      setErrorEventos(err.message);
    } finally {
      setIsLoadingEventos(false); 
    }
  }, []); 

  const fetchAtividades = useCallback(async () => {
    setIsLoadingAtividades(true);
    try {
      const response = await fetch('http://localhost:4000/api/atividades'); 
      if (!response.ok) throw new Error('Falha ao buscar atividades');
      const data = await response.json();
      setAtividades(data); // Salva as atividades no estado
      setErrorAtividades(null);
    } catch (err) {
      setErrorAtividades(err.message);
    } finally {
      setIsLoadingAtividades(false); 
    }
  }, []);

  // --- Efeito para buscar TUDO QUANDO A PÁGINA CARREGA ---
  useEffect(() => {
    fetchEventos();
    fetchAtividades(); 
  }, [fetchEventos, fetchAtividades]);

  // --- Função para renderizar o carrossel ---
  const renderAtividadesCarrossel = () => {
    if (isLoadingAtividades) {
      return <div style={{ textAlign: 'center', padding: '50px', color: 'white' }}>A carregar atividades...</div>;
    }
    if (errorAtividades) {
      return <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>Erro: {errorAtividades}</div>;
    }
    if (atividades.length === 0) {
      // Se o banco está vazio, mostre o conteúdo original (Sopa Fraterna) como fallback
      return (
        <div className={`carousel-slide active-slide`}>
          <div className="slide-top-bar" style={{ backgroundColor: '#6efff1' }}></div>
          <div className="slide-content-wrapper">
            <div className="image-grid">
              <div className="grid-image-placeholder"><img src="/documentos/Sopa 16.04.21 011.jpg" alt="Sopa Imagem 1" /></div>
              <div className="grid-image-placeholder"><img src="/documentos/Sopa 16.04.21 021.jpg" alt="Sopa Imagem 2" /></div>
              <div className="grid-image-placeholder"><img src="/documentos/Sopa 16.04.21 098.jpg" alt="Sopa Imagem 3" /></div>
              <div className="grid-image-placeholder"><img src="/documentos/Sopa 16.04.21 130.jpg" alt="Sopa Imagem 4" /></div>
            </div>
            <div className="description-panel">
              <h2>SOPA FRATERNA</h2>
              <div className="description-placeholder">
                <p>O Instituto Alma acredita no poder de um prato de comida quente para aquecer o corpo e o coração. Em nossa ação da "Sopa Fraterna", nossos voluntários se unem em um verdadeiro mutirão de solidariedade...</p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    const imageBaseUrl = 'http://localhost:4000/uploads/';

    // Mapeia os dados do banco de dados para os slides
    return atividades.map((atividade, index) => (
      <div 
        key={atividade.id}
        className={`carousel-slide ${activeSlide === index ? 'active-slide' : ''}`}
      >
        <div className="slide-top-bar" style={{ backgroundColor: '#6efff1' }}></div>
        <div className="slide-content-wrapper">
          <div className="image-grid">
            {/* Mostra as imagens (se existirem) */}
            {atividade.imagem_url_1 && (
              <div className="grid-image-placeholder">
                <img src={imageBaseUrl + atividade.imagem_url_1} alt={`${atividade.titulo} 1`} />
              </div>
            )}
            {atividade.imagem_url_2 && (
              <div className="grid-image-placeholder">
                <img src={imageBaseUrl + atividade.imagem_url_2} alt={`${atividade.titulo} 2`} />
              </div>
            )}
            {atividade.imagem_url_3 && (
              <div className="grid-image-placeholder">
                <img src={imageBaseUrl + atividade.imagem_url_3} alt={`${atividade.titulo} 3`} />
              </div>
            )}
            {atividade.imagem_url_4 && (
              <div className="grid-image-placeholder">
                <img src={imageBaseUrl + atividade.imagem_url_4} alt={`${atividade.titulo} 4`} />
              </div>
            )}
          </div>
          <div className="description-panel">
            <h2>{atividade.titulo.toUpperCase()}</h2>
            <div className="description-placeholder">
              {/* Usa o 'whiteSpace: pre-wrap' para respeitar as quebras de linha do <textarea> */}
              <p style={{ whiteSpace: 'pre-wrap' }}>{atividade.descricao}</p>
            </div>
          </div>
        </div>
      </div>
    ));
  };

  // --- Função para renderizar os PONTOS de navegação ---
  const renderCarrosselDots = () => {
    const colors = ['#f06678', '#ffc9fc', '#64B5F6', '#6efff1'];
    
    // (CORREÇÃO) Se 'atividades' estiver vazio, use o 'slidesData' (o array de fallback)
    const items = atividades.length > 0 ? atividades : slidesData; 

    return items.map((item, index) => (
      <div 
        key={item.id || index} // Usa item.id (do banco) ou index (do fallback)
        className={`nav-dot ${activeSlide === index ? 'active-dot' : ''}`}
        style={{ backgroundColor: colors[index] || colors[0] }}
        onClick={() => setActiveSlide(index)} 
      />
    ));
  };


  // --- Função para renderizar lista de EVENTOS ---
  const renderEventosList = () => {
    if (isLoadingEventos) {
      return <div className="evento-info-box">A carregar eventos...</div>;
    }
    if (errorEventos) {
      return <div className="evento-info-box" style={{ color: 'red' }}>{errorEventos}</div>;
    }
    if (eventos.length === 0) {
      // Fallback para o evento estático se o banco de dados estiver vazio
      return (
        <div className="evento-info-box">
          <strong>23/12 - Ação de Natal</strong><br />
          Local: Av. da Liberdade, 532 - Liberdade, São Paulo - SP, 01502-001
        </div>
      );
    }
    const proximoEvento = eventos[0]; 
    return (
      <div className="evento-info-box">
        <strong>{proximoEvento.titulo}</strong><br />
        <strong>Data:</strong> {proximoEvento.data_formatada}<br />
        <strong>Local:</strong> {proximoEvento.local}
      </div>
    );
  };


  // --- Função para ENVIAR OUVIDORIA ---
  const handleSubmitOuvidoria = async (event) => {
    event.preventDefault(); 
    setFormStatus('Enviando...'); 
    const formData = {
      nome: ouvidoriaNome,
      email: ouvidoriaEmail,
      telefone: ouvidoriaTelefone,
      mensagem: ouvidoriaMensagem
    };
    try {
      const response = await fetch('http://localhost:4000/api/ouvidoria', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        setFormStatus(data.message);
        setOuvidoriaNome('');
        setOuvidoriaEmail('');
        setOuvidoriaTelefone('');
        setOuvidoriaMensagem('');
      } else {
        setFormStatus(`Erro: ${data.message}`);
      }
    } catch (error) {
      console.error('Erro ao conectar com a API:', error);
      setFormStatus('Erro: Não foi possível conectar ao servidor.');
    }
  };


  return (
    <> 
      <main> 
        
        {/* --- SEÇÃO HERO --- */}
        <section className="hero-section" id="home">
          <div className="hero-image-card">
            <div className="image-placeholder">
              <img src="/documentos/image.png" alt="Voluntária do Instituto Alma sorrindo" />
            </div>
            <div className="color-bars">
              <div className="bar" style={{ backgroundColor: '#f06678' }}></div>
              <div className="bar" style={{ backgroundColor: '#ffc9fc' }}></div>
              <div className="bar" style={{ backgroundColor: '#64B5F6' }}></div>
              <div className="bar" style={{ backgroundColor: '#6efff1' }}></div>
            </div>
          </div>
          <div className="hero-text">
            <h1>O Instituto Alma é uma luz de esperança nas comunidades mais esquecidas e vulneráveis da sociedade.</h1>
          </div>
        </section>

        {/* --- SEÇÃO SOBRE NÓS --- */}
        <section id="sobre-nos" className="sobre-nos-section">
          <h2 className="section-title" style={{ display: 'none' }}>Sobre Nós</h2>
          <div className="thin-bar"></div>
          <div className="about-container">
            <div className="about-image-card">
              <img src="/documentos/Sopa 16.04.21 014.jpg" alt="Foto1" />
            </div>
            <div className="about-text-card">
              <h2>Sobre Nós</h2>
              <p>O instituto Alma surgiu com a proposta de
                 promover a transformação social através de
                 ações diferenciadas, feitas como objetivo de
                 encantar e proporcionar algo único e especial
                 para a vida das pessoas.</p>
              <p>O público-alvo são os moradores de comunidades
                 muito carentes esquecidas.</p>
            </div>
            <div className="about-image-card">
              <img src="/documentos/Sopa 16.04.21 040.jpg" alt="Foto2" />
            </div>
          </div>
          <div className="bottom-color-bars">
             <div className="bottom-bar" style={{ backgroundColor: '#f06678' }}></div>
             <div className="bottom-bar" style={{ backgroundColor: '#ffc9fc' }}></div>
             <div className="bottom-bar" style={{ backgroundColor: '#64B5F6' }}></div>
             <div className="bottom-bar" style={{ backgroundColor: '#6efff1' }}></div>
             <div className="bottom-bar" style={{ backgroundColor: '#f06678' }}></div>
             <div className="bottom-bar" style={{ backgroundColor: '#ffc9fc' }}></div>
             <div className="bottom-bar" style={{ backgroundColor: '#64B5F6' }}></div>
          </div>
        </section>

        {/* --- (NOVO) SEÇÃO ATIVIDADES (DINÂMICA) --- */}
        <section id="atividades" className="atividades-section">
          <h2 className="section-title">Nossas Atividades</h2>
          <div className="carousel-container">
            
            {/* O conteúdo do carrossel agora é dinâmico */}
            <div className="carousel-track">
              {renderAtividadesCarrossel()}
            </div>
            
            {/* Os pontos de navegação agora são dinâmicos */}
            <div className="carousel-navigation">
              {renderCarrosselDots()}
            </div>
          </div>
        </section>

        {/* --- SEÇÃO TRANSPARÊNCIA (TEXTOS RESTAURADOS) --- */}
        <section id="transparencia" className="transparencia-section">
          <h2 className="section-title">Portal de Transparência</h2>
          <div className="thin-bar" style={{ backgroundColor: '#6efff1' }}></div>
          <div className="transparencia-wrapper">
            <div className="transparencia-col-left">
              <div className="info-card">
                {/* === TEXTO COMPLETO RESTAURADO === */}
                <p>Acreditamos na transparência total. Para que você acompanhe de perto como sua generosidade se transforma em ação, disponibilizamos nossos relatórios de atividades e financeiros.</p>
                <Link to="/relatorios" className="btn btn-red">Saiba Mais</Link>
              </div>
              <div className="info-card">
                {/* === TEXTO COMPLETO RESTAURADO === */}
                <p>O Instituto Alma é feito por pessoas comprometidas com nossa missão. Conheça aqui nossos sócios, fundadores e a diretoria responsável pela gestão e governança da organização.</p>
                <Link to="/governanca" className="btn btn-red">Saiba Mais</Link>
              </div>
            </div>
            <div className="transparencia-col-right">
              <div className="info-card">
                <h3>Sua Confiança é Importante para Nós</h3>
                {/* === TEXTO COMPLETO RESTAURADO === */}
                <p>No Instituto Alma, a transparência é o alicerce do nosso trabalho. Acreditamos que prestar contas de forma clara é fundamental para honrar a generosidade de quem nos apoia.</p>
                <p>Temos um compromisso firme com a gestão responsável de todos os recursos. Cada doação recebida é registrada e direcionada com o máximo cuidado para nossas ações, seja na compra de alimentos para a Sopa Fraterna, na montagem das cestas básicas ou no apoio às mães.</p>
                <p>Seu apoio nos permite levar dignidade e esperança, e é por isso que fazemos questão de sermos transparentes sobre como sua contribuição se transforma em ajuda real.</p>
              </div>
            </div>
          </div>
          <div className="bottom-color-bars">
             <div className="bottom-bar" style={{ backgroundColor: '#f06678' }}></div>
             <div className="bottom-bar" style={{ backgroundColor: '#ffc9fc' }}></div>
             <div className="bottom-bar" style={{ backgroundColor: '#64B5F6' }}></div>
             <div className="bottom-bar" style={{ backgroundColor: '#6efff1' }}></div>
             <div className="bottom-bar" style={{ backgroundColor: '#f06678' }}></div>
             <div className="bottom-bar" style={{ backgroundColor: '#ffc9fc' }}></div>
             <div className="bottom-bar" style={{ backgroundColor: '#64B5F6' }}></div>
          </div>
        </section>

        {/* --- SEÇÃO EVENTOS (DINÂMICA) --- */}
        <section id="eventos" className="eventos-section">
          <h2 className="section-title">Se Agende Para Participar Dos Nossos Eventos</h2>
          <div className="thin-bar" style={{ backgroundColor: '#6efff1' }}></div>
          <div className="eventos-wrapper">
            <div className="eventos-calendario">
              <h3>Dezembro 2025</h3>
              <table className="calendario-table">
                <thead>
                  <tr>
                    <th>Segunda-Feira</th>
                    <th>Terça-Feira</th>
                    <th>Quarta-Feira</th>
                    <th>Quinta-Feira</th>
                    <th>Sexta-Feira</th>
                    <th>Sábado</th>
                    <th>Domingo</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>1</td><td>2</td><td>3</td><td>4</td><td>5</td><td>6</td><td>7</td></tr>
                  <tr><td>8</td><td>9</td><td>10</td><td>11</td><td>12</td><td>13</td><td>14</td></tr>
                  <tr><td>15</td><td>16</td><td>17</td><td>18</td><td>19</td><td>20</td><td>21</td></tr>
                  <tr><td>22</td><td className="dia-evento"><span>23</span></td><td>24</td><td>25</td><td>26</td><td>27</td><td>28</td></tr>
                  <tr><td>29</td><td>30</td><td>31</td><td className="dia-desabilitado">1</td><td className="dia-desabilitado">2</td><td className="dia-desabilitado">3</td><td className="dia-desabilitado">4</td></tr>
                </tbody>
              </table>
            </div>
            <div className="eventos-sidebar">
              
              <div className="sidebar-widget">
                <h4>Eventos em Breve:</h4>
                {/* A lista de eventos é dinâmica */}
                {renderEventosList()}
              </div>
              
              <div className="sidebar-widget">
                <h4>Seja notificado sobre nossos próximos eventos e participe!</h4>
                <button onClick={openModal} className="btn btn-red">Me Notifique</button>
              </div>

              <div className="sidebar-widget">
                <h4>Acomapnhe pelas redes:</h4>
                <div className="social-icons">
                  <a href="https://www.instagram.com/almainstituto_oficial" target="_blank" rel="noopener noreferrer" className="social-icon ig" title="Instagram">IG</a>
                  <a href="https://www.facebook.com/almainstituto.oficial" target="_blank" rel="noopener noreferrer" className="social-icon fb" title="Facebook">FB</a>
                  <a href="https://www.youtube.com/" target="_blank" rel="noopener noreferrer" className="social-icon yt" title="YouTube">YT</a>
                </div>
              </div>
            </div>
          </div>
          <div className="bottom-color-bars">
             <div className="bottom-bar" style={{ backgroundColor: '#f06678' }}></div>
             <div className="bottom-bar" style={{ backgroundColor: '#ffc9fc' }}></div>
             <div className="bottom-bar" style={{ backgroundColor: '#64B5F6' }}></div>
             <div className="bottom-bar" style={{ backgroundColor: '#6efff1' }}></div>
             <div className="bottom-bar" style={{ backgroundColor: '#f06678' }}></div>
             <div className="bottom-bar" style={{ backgroundColor: '#ffc9fc' }}></div>
             <div className="bottom-bar" style={{ backgroundColor: '#64B5F6' }}></div>
          </div>
        </section>

        {/* --- SEÇÃO OUVIDORIA (CONECTADA) --- */}
        <section id="ouvidoria" className="ouvidoria-section">
          <h2 className="section-title">Ouvidoria</h2>
          <div className="thin-bar" style={{ backgroundColor: '#6efff1' }}></div>
          <p className="ouvidoria-subtitle">TEM SUGESTÕES? RELATOS? RECLAMAÇÕES?</p>
          <p className="ouvidoria-subtitle last">FALE CONOSCO! ESTAMOS AQUI PARA TE OUVIR</p>
          
          <form onSubmit={handleSubmitOuvidoria} className="form-container">
            <div className="form-col-left">
              <div className="form-group">
                <label htmlFor="form-nome" className="form-label">Nome</label>
                <input 
                  type="text" 
                  id="form-nome" 
                  className="form-input" 
                  value={ouvidoriaNome}
                  onChange={(e) => setOuvidoriaNome(e.target.value)}
                  required 
                />
              </div>
              <div className="form-group">
                <label htmlFor="form-email" className="form-label">Email</label>
                <input 
                  type="email" 
                  id="form-email" 
                  className="form-input" 
                  value={ouvidoriaEmail}
                  onChange={(e) => setOuvidoriaEmail(e.target.value)}
                  required 
                />
              </div>
              <div className="form-group">
                <label htmlFor="form-telefone" className="form-label">Telefone</label>
                <input 
                  type="tel" 
                  id="form-telefone" 
                  className="form-input"
                  value={ouvidoriaTelefone}
                  onChange={(e) => setOuvidoriaTelefone(e.target.value)}
                />
              </div>
              <button type="submit" className="btn btn-red">Enviar</button>
              
              {formStatus && (
                <p style={{ 
                  marginTop: '20px', 
                  fontWeight: '600',
                  color: formStatus.startsWith('Erro:') ? '#f06678' : '#6efff1' 
                }}>
                  {formStatus}
                </p>
              )}

            </div>
            <div className="form-col-right">
              <div className="form-group-textarea">
                <label htmlFor="form-mensagem" className="form-label">Escreva aqui:</label>
                <textarea 
                  id="form-mensagem" 
                  className="form-textarea" 
                  value={ouvidoriaMensagem}
                  onChange={(e) => setOuvidoriaMensagem(e.target.value)}
                  required
                ></textarea>
              </div>
            </div>
          </form>
          <div className="bottom-color-bars">
             <div className="bottom-bar" style={{ backgroundColor: '#f06678' }}></div>
             <div className="bottom-bar" style={{ backgroundColor: '#ffc9fc' }}></div>
             <div className="bottom-bar" style={{ backgroundColor: '#64B5F6' }}></div>
             <div className="bottom-bar" style={{ backgroundColor: '#6efff1' }}></div>
             <div className="bottom-bar" style={{ backgroundColor: '#f06678' }}></div>
             <div className="bottom-bar" style={{ backgroundColor: '#ffc9fc' }}></div>
             <div className="bottom-bar" style={{ backgroundColor: '#64B5F6' }}></div>
          </div>
        </section>

      </main>
      
      {/* O Modal de Eventos */}
      {isModalOpen && <EventModal onClose={closeModal} />}

    </>
  );
}

export default HomePage;