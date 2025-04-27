import React, { useEffect, useState } from "react";
import axios from "axios";
import "./filmCrudGrid.css";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/EditOutlined";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import Box from "@mui/material/Box";
import {
  DataGrid,
  GridToolbarContainer,
  GridActionsCellItem,
} from "@mui/x-data-grid";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import DialogContentText from "@mui/material/DialogContentText";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";

function EditToolbar(props) {
  const { handleClickOpen } = props;

  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} onClick={handleClickOpen}>
        Add record
      </Button>
    </GridToolbarContainer>
  );
}

export default function FilmCrudGrid({ film, fetchFilmData }) {
  const [rows, setRows] = useState(film);
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteRowId, setDeleteRowId] = useState(null);

  const [newFilm, setNewFilm] = useState({
    filmId: "",
    title: "",
    description: "",
    length: "",
    rating: "Choose a rating",
  });

  const [editFilm, setEditFilm] = useState({
    filmId: "",
    title: "",
    description: "",
    length: "",
    rating: "",
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleEditClose = () => {
    setOpenEdit(false);
  };

  const handleConfirmDeleteClose = () => {
    setConfirmDelete(false);
    setDeleteRowId(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewFilm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFilm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const apiUrl = "http://localhost:3000/film/add";
    try {
      const payload = { newFilm };
      const response = await axios.post(apiUrl, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status === 200) {
        await fetchFilmData(); // Wait for fetchFilmData to complete
        console.log("Film added: ", response.data);
        window.alert("Record added successfully");
      } else {
        console.error("Failed to add film: ", response.status);
      }
    } catch (err) {
      console.error("Error adding film data: ", err);
    } finally {
      handleClose();
    }
  };

  const handleEditClick = (id) => () => {
    const filmToEdit = rows.find((row) => row.id === id);
    setEditFilm(filmToEdit);
    setOpenEdit(true);
  };

  const handleSaveEdit = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/film/edit",
        { editFilm },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        await fetchFilmData(); // Wait for fetchFilmData to complete
        console.log("Film edited: ", response.data);
        window.alert("Record edited successfully");
      } else {
        console.error("Failed to edit film: ", response.status);
      }
    } catch (err) {
      console.error("Error editing film data: ", err);
    } finally {
      setOpenEdit(false);
    }
  };

  const handleDeleteClick = (id) => () => {
    setDeleteRowId(id);
    setConfirmDelete(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/film/delete",
        { filmId: deleteRowId },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        await fetchFilmData(); // Wait for fetchFilmData to complete
        console.log("Film deleted: ", response.data);
        window.alert("Record deleted successfully");
      } else {
        console.error("Failed to delete film: ", response.status);
      }
    } catch (err) {
      console.error("Error deleting film data: ", err);
    } finally {
      setRows(rows.filter((row) => row.id !== deleteRowId));
      handleConfirmDeleteClose();
    }
  };

  useEffect(() => {
    setRows(film);
  }, [film]);

  const columns = [
    {
      field: "id",
      headerName: "Film ID",
      width: 100,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "title",
      headerName: "Title",
      width: 150,
      headerAlign: "center",
    },
    {
      field: "description",
      headerName: "Description",
      width: 300,
      headerAlign: "center",
    },
    {
      field: "length",
      headerName: "Length",
      type: "number",
      width: 100,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "rating",
      headerName: "Rating",
      width: 100,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      cellClassName: "actions",
      getActions: ({ id }) => {
        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  return (
    <div className="container">
      <Box>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{
            pagination: { paginationModel: { pageSize: 5 } },
          }}
          pageSizeOptions={[5, 10, 25, 50]}
          disableRowSelectionOnClick
          showCellVerticalBorder
          editMode="row"
          slots={{
            toolbar: EditToolbar,
          }}
          slotProps={{
            toolbar: { handleClickOpen },
          }}
        />
      </Box>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add New Record</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            name="title"
            label="Title"
            type="text"
            fullWidth
            value={newFilm.title}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="description"
            label="Description"
            type="text"
            fullWidth
            value={newFilm.description}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="length"
            label="Length"
            type="number"
            fullWidth
            value={newFilm.length}
            onChange={handleChange}
          />
          <Select
            margin="dense"
            name="rating"
            id="rating"
            fullWidth
            value={newFilm.rating}
            onChange={handleChange}
            style={{ marginTop: "8px" }}
            renderValue={(value) => (
              <span style={{ color: value === 'Choose a rating' ? '#666666' : 'inherit' }}>
                {value}
              </span>
            )}
          >
            <MenuItem value={"G"}>G</MenuItem>
            <MenuItem value={"PG"}>PG</MenuItem>
            <MenuItem value={"PG-13"}>PG-13</MenuItem>
            <MenuItem value={"R"}>R</MenuItem>
            <MenuItem value={"NC-17"}>NC-17</MenuItem>
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Submit</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openEdit} onClose={handleEditClose}>
        <DialogTitle>Edit Record</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            name="title"
            label="Title"
            type="text"
            fullWidth
            value={editFilm.title}
            onChange={handleEditChange}
          />
          <TextField
            margin="dense"
            name="description"
            label="Description"
            type="text"
            fullWidth
            value={editFilm.description}
            onChange={handleEditChange}
          />
          <TextField
            margin="dense"
            name="length"
            label="Length"
            type="number"
            fullWidth
            value={editFilm.length}
            onChange={handleEditChange}
          />
          <Select
            margin="dense"
            name="rating"
            id="edit-rating"
            fullWidth
            value={editFilm.rating}
            onChange={handleEditChange}
            style={{ marginTop: "8px" }}  
          >
            <MenuItem value={"G"}>G</MenuItem>
            <MenuItem value={"PG"}>PG</MenuItem>
            <MenuItem value={"PG-13"}>PG-13</MenuItem>
            <MenuItem value={"R"}>R</MenuItem>
            <MenuItem value={"NC-17"}>NC-17</MenuItem>
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose}>Cancel</Button>
          <Button onClick={handleSaveEdit}>Save</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={confirmDelete} onClose={handleConfirmDeleteClose}>
        <DialogTitle>Confirm Record Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmDeleteClose}>No</Button>
          <Button onClick={handleConfirmDelete}>Yes</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
