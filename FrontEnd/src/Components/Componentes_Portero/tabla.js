import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faTrash, faClock, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import './FilterButtons.css';
import AddGuestModal from './AddGuestModal'; // Importar el modal de agregar
import EditGuestModal from './EditGuestModal'; // Importar el modal de editar

library.add(faTrash, faPenToSquare, faClock);

const Tabla = ({ item, apiS }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  const [data, setDatos] = useState([]);
  const [filterAvailable, setFilterAvailable] = useState(false);
  const [filterType, setFilterType] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [guestToEdit, setGuestToEdit] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(`http://localhost:4000/${apiS}`);
        setDatos(response.data);
      } catch (error) {
        console.error("Error al obtener los datos:", error);
      }
    }
    fetchData();
  }, [apiS]);

  const filterData = () => {
    let filteredData = data;

    if (apiS === "Parqueadero") {
      if (filterAvailable) {
        filteredData = filteredData.filter(record => record.Estado === "Disponible");
      }
  
      if (filterType) {
        filteredData = filteredData.filter(record => record.TipoEspacio === filterType);
      }
    }

    return filteredData;
  };

  const filteredRecords = filterData();
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredRecords.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleOpenAddModal = () => setShowAddModal(true);
  const handleCloseAddModal = () => setShowAddModal(false);

  const handleOpenEditModal = (guest) => {
    setGuestToEdit(guest);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setGuestToEdit(null);
    setShowEditModal(false);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/${apiS}/${id}`);
      setDatos(data.filter(record => record.id !== id)); // Asumiendo que el id es un campo único
    } catch (error) {
      console.error('Error al eliminar el registro:', error);
    }
  };

  const refreshData = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/${apiS}`);
      setDatos(response.data);
    } catch (error) {
      console.error("Error al obtener los datos:", error);
    }
  };

  return (
    <div className="container mt-4">
      <div className="card shadow-sm">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Lista de {apiS}</h5>
          <div className="d-flex">
            {apiS === "Parqueadero" && (
              <>
                <button
                  className={`filter-btn me-2 ${filterAvailable ? 'active' : ''}`}
                  onClick={() => setFilterAvailable(!filterAvailable)}
                >
                  {filterAvailable ? "Ver Todos" : "Disponibles"}
                </button>
                <button
                  className={`filter-btn me-2 ${filterType === "Carro" ? 'active' : ''}`}
                  onClick={() => setFilterType(filterType === "Carro" ? "" : "Carro")}
                >
                  {filterType === "Carro" ? "Ver Todos" : "Carros"}
                </button>
                <button
                  className={`filter-btn ${filterType === "Moto" ? 'active' : ''}`}
                  onClick={() => setFilterType(filterType === "Moto" ? "" : "Moto")}
                >
                  {filterType === "Moto" ? "Ver Todos" : "Motos"}
                </button>
              </>
            )}
            <form className="d-flex ms-2" role="search">
              <input
                className="form-control me-2"
                type="search"
                placeholder="Buscar"
                aria-label="Buscar"
              />
              <button className="btn btn-outline-success" type="submit">
                Buscar
              </button>
            </form>
          </div>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-bordered table-hover mb-0">
              <thead className="table-light">
                <tr>
                  {item.map((header, index) => (
                    <th className="text-center text-light bg-dark" key={index}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {apiS === "Propietarios"
                  ? currentRecords.map((record, index) => (
                      <tr key={index}>
                        <td>{record.CodigoVivienda}</td>
                        <td>{record.Nombre}</td>
                        <td>{record.Teléfono}</td>
                        <td>{record.Correo}</td>
                        <td>{record.NumeroDocumento}</td>
                        <td>{record.MesesAtrasados}</td>
                      </tr>
                    ))
                  : apiS === "Parqueadero"
                  ? currentRecords.map((record, index) => (
                      <tr key={index}>
                        <td>{record.NumeroEspacio}</td>
                        <td>{record.TipoEspacio}</td>
                        <td>{record.Estado}</td>
                      </tr>
                    ))
                  : apiS === "Invitados"
                  ? currentRecords.map((record, index) => (
                      <tr key={index}>
                        <td>{record.Nombre}</td>
                        <td>{record.NumeroDocumento}</td>
                        <td>{record.Teléfono}</td>
                        <td>{record.Correo}</td>
                        <td>{record.NumeroParqueadero}</td>
                        <td>{record.Costo}</td>
                        <td>{record.CodigoVivienda}</td>
                        <td className="text-center">
                          <FontAwesomeIcon icon={faClock} className="text-info" role="button" />
                        </td>
                        <td className="text-center">
                          <FontAwesomeIcon 
                            icon={faTrash} 
                            className="mr-3 text-danger" 
                            role="button" 
                            onClick={() => handleDelete(record.id)} 
                          />
                          <FontAwesomeIcon 
                            icon={faPenToSquare} 
                            className="text-warning" 
                            role="button" 
                            onClick={() => handleOpenEditModal(record)} // Aquí abrimos el modal de edición
                          />
                        </td>
                      </tr>
                    ))
                  : currentRecords.map((record, index) => (
                      <tr key={index}>
                        <td>{record.Nombre}</td>
                        <td>{record.NumeroDocumento}</td>
                        <td>{record.Teléfono}</td>
                        <td>{record.Correo}</td>
                        <td>{record.TipoTurno}</td>
                        <td className="text-center">
                          <FontAwesomeIcon 
                            icon={faTrash} 
                            className="me-2" 
                            role="button" 
                            onClick={() => handleDelete(record.id)} 
                          />
                          <FontAwesomeIcon 
                            icon={faPenToSquare} 
                            role="button" 
                            onClick={() => handleOpenEditModal(record)} 
                          />
                        </td>
                      </tr>
                    ))}
              </tbody>
              <tfoot className="table-light">
                <tr>
                  {item.map((header, index) => (
                    <th className="text-center text-light bg-dark" key={index}>{header}</th>
                  ))}
                </tr>
              </tfoot>
            </table>
          </div>
          <nav className="d-flex justify-content-center mt-3">
            <ul className="pagination">
              {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
                <li
                  key={pageNumber}
                  className={`page-item ${currentPage === pageNumber ? "active" : ""}`}
                >
                  <Link
                    to="#"
                    className="page-link"
                    onClick={() => handlePageChange(pageNumber)}
                  >
                    {pageNumber}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          {apiS === "Invitados" && (
            <div className="d-flex justify-content-end mt-3">
              <button
                className="btn btn-success w-25 m-1"
                onClick={handleOpenAddModal}
              >
                Agregar Invitado
              </button>
            </div>
          )}
        </div>
      </div>
      <AddGuestModal showModal={showAddModal} handleClose={handleCloseAddModal} />
      <EditGuestModal showModal={showEditModal} handleClose={handleCloseEditModal} guestToEdit={guestToEdit} refreshData={refreshData} />
    </div>
  );
};

export default Tabla;
