import React, { useEffect, useState } from 'react';
import { Container, Navbar, Nav } from 'react-bootstrap';
import {
  FaHome,
  FaCalendarAlt,
  FaComments,
  FaFileAlt,
  FaFolder,
  FaSignOutAlt,
  FaUsers,
  FaEnvelope,
  FaClipboardList,
  FaTicketAlt
} from 'react-icons/fa';
import './dashboard.css';
import Roles from '../roles/Roles';
import CargarServicio from '../cargaServicios/cargarServicios';
import ExcepcionesProf from '../excepcionesProf/excepcionesProf';
import { FaCalendarTimes } from 'react-icons/fa';
import Agendas from '../agendas/agendas';
import AgendaRegular from '../agendaRegular/agendaRegular';
import Chat from '../chat/chat';
import FichaMedica from '../fichaMedica/fichaMedica';

const Dashboard = ({ setIsLoggedIn, tieneMensajesNuevos, setTieneMensajesNuevos }) => {
  const [visibleIcons, setVisibleIcons] = useState([]);
  const [vista, setVista] = useState('inicio');
  const [roles, setRoles] = useState({});

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    window.location.href = '/';
  };

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
      window.location.href = '/';
      return;
    }

    let parsedRoles = {};
    try {
      const rawRoles = localStorage.getItem('roles');
      parsedRoles = rawRoles && rawRoles !== 'undefined' ? JSON.parse(rawRoles) : {};
    } catch (error) {
      parsedRoles = {};
    }

    setRoles(parsedRoles);

    const bool = (val) => val === true || val === 1 || val === "1";

    const allIcons = [
      { id: 'home', component: <FaHome className="fs-4 mt-5 mb-4 text-secondary hover-icon" title="Inicio" key="home" onClick={() => setVista('inicio')} /> },
      { id: 'calendar', component: <FaCalendarAlt className="fs-4 mb-4 text-secondary hover-icon" title="Gestión de Agendas" key="agendas" onClick={() => setVista('agendas')} /> },
      { id: 'comments', component: (
        <FaComments
          className={`mb-4 hover-icon ${tieneMensajesNuevos ? 'text-danger' : 'text-secondary'}`}
          title="Chat"
          key="comments"
          onClick={() => {
            setVista('chat');
            setTieneMensajesNuevos(false);
          }}
        />
      )},
      { id: 'file', component: <FaFileAlt className="fs-4 mb-4 text-secondary hover-icon" key="file" onClick={() => setVista('inicio')} /> },
      { id: 'folder', component: <FaFolder className="fs-4 mb-4 text-secondary hover-icon" key="folder" onClick={() => setVista('inicio')} /> },
      { id: 'excepcionesProf', component: <FaCalendarTimes className="fs-4 mb-4 text-secondary hover-icon" key="excepciones" onClick={() => setVista('excepcionesProf')} /> },
      { id: 'servicios', component: <FaClipboardList className="fs-4 mb-4 text-secondary hover-icon" title="Gestión de Servicios" key="servicios" onClick={() => setVista('servicios')} /> },
      { id: 'turnos', component: <FaTicketAlt className="fs-4 mb-4 text-secondary hover-icon" title="Gestión de Turnos" key="turnos" onClick={() => setVista('turnos')} /> },
      { id: 'agendaRegular', component: <FaCalendarAlt className="fs-4 mb-4 text-secondary hover-icon" title="Agenda Regular" key="agendaRegular" onClick={() => setVista('agendaRegular')} /> },
      { id: 'fichaMedica', component: <FaFileAlt className="fs-4 mb-4 text-secondary hover-icon" title="Ficha Médica" key="fichaMedica" onClick={() => setVista('fichaMedica')} /> },
    ];

    let allowedIds = [];

    if (bool(parsedRoles.rolsuperadmin)) {
      allowedIds = ['home', 'calendar', 'agendaRegular', 'file', 'fichaMedica','folder', 'servicios', 'turnos', 'excepcionesProf'];
    } else if (bool(parsedRoles.roladministrativo)) {
      allowedIds = ['home', 'calendar', 'agendaRegular', 'fichaMedica','servicios', 'turnos', 'excepcionesProf'];
    } else if (bool(parsedRoles.rolmedico) || bool(parsedRoles.rolpaciente)) {
      allowedIds = ['home', 'comments', 'turnos', 'fichaMedica'];
    } else {
      allowedIds = ['home', 'comments','fichaMedica'];
    }

    const filteredIcons = allIcons.filter(icon => allowedIds.includes(icon.id));
    setVisibleIcons(filteredIcons);

  }, [tieneMensajesNuevos, setTieneMensajesNuevos]);

  return (
    <div className="d-flex min-vh-100 flex-column">
      <div className="d-flex flex-grow-1">
        <div className="bg-white border-end d-flex flex-column align-items-center p-2 mt-4" style={{ width: '60px' }}>
          {visibleIcons.map(icon => icon.component)}

          <FaUsers
            className="fs-4 mb-4 text-secondary hover-icon"
            title="Gestión de Usuarios"
            style={{ cursor: 'pointer' }}
            onClick={() => setVista('roles')}
          />

          <FaSignOutAlt
            className="fs-4 mt-auto mb-2 text-danger hover-icon"
            title="Cerrar sesión"
            onClick={handleLogout}
            style={{ cursor: 'pointer' }}
          />
        </div>

        <div className="flex-grow-1 d-flex flex-column">
          <Navbar bg="white" expand="lg" className="shadow-sm px-4 py-2 justify-content-between">
            <Navbar.Brand className="text-primary fw-bold">Clínica<span className="text-dark">Medica</span></Navbar.Brand>
            <Nav className="d-flex align-items-center gap-3">
              {!(roles.roladministrativo || roles.rolsuperadmin) && (
                <div className={`rounded-circle d-flex justify-content-center align-items-center ${tieneMensajesNuevos ? 'bg-danger' : 'bg-secondary'}`} style={{ width: '30px', height: '30px' }}>
                  <FaComments color="white" />
                </div>
              )}
              <div className="rounded-circle bg-info d-flex justify-content-center align-items-center" style={{ width: '30px', height: '30px' }}>
                <FaEnvelope color="white" />
              </div>
              <span className="text-muted small">
                {(() => {
                  try {
                    const usuarioRaw = localStorage.getItem('usuario');
                    const usuario = typeof usuarioRaw === 'string' && usuarioRaw.startsWith('{')
                      ? JSON.parse(usuarioRaw)
                      : { nombre: usuarioRaw };

                    return `${usuario?.nombre ?? 'Usuario'} ${usuario?.apellido ?? ''}`.trim();
                  } catch (e) {
                    return 'Usuario';
                  }
                })()}
              </span>

            </Nav>
          </Navbar>

          <Container fluid className="flex-grow-1 p-4 bg-light">
            {vista === 'roles' ? (
              <Roles />
            ) : vista === 'servicios' ? (
              <CargarServicio />
            ) : vista === 'excepcionesProf' ? (
              <ExcepcionesProf />
            ) : vista === 'agendas' ? (
              <Agendas />
            ) : vista === 'agendaRegular' ? (
              <AgendaRegular />
            ) : vista === 'fichaMedica' ? (
              <FichaMedica />
            ) : vista === 'chat' ? (
              <Chat setTieneMensajesNuevos={setTieneMensajesNuevos} />
            ) : (
              <h4 className="text-primary">Inicio</h4>
            )}
          </Container>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
