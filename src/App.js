import React, { useState, useEffect } from "react";

import api from "./services/api";

import "./styles.css";

function App() {
	const [repositories, setRepositories] = useState([]);

	const [formData, setFormData] = useState({ title: "", url: "", techs: "" });

	useEffect(() => {
		api.get("/repositories").then((response) => {
			if (!response.data.error) setRepositories(response.data);
		});
	}, []);

	function handleInputChange(event) {
		const { name, value } = event.target;

		setFormData({ ...formData, [name]: value });
	}

	async function handleAddRepository(event) {
		event.preventDefault();

		const { title, url, techs } = formData;

		const response = await api.post("/repositories", {
			title,
			url,
			techs: techs.split(","),
		});

		setRepositories([...repositories, response.data]);
	}

	async function handleRemoveRepository(id) {
		await api.delete(`/repositories/${id}`);

		setRepositories(repositories.filter((repository) => repository.id !== id));
	}

	async function handleLikeRepository(id) {
		await api.post(`/repositories/${id}/like`);
	}

	return (
		<>
			<ul data-testid="repository-list">
				{repositories.map((repository) => (
					<li key={repository.id}>
						{repository.title}
						<button onClick={() => handleLikeRepository(repository.id)}>
							Like!
						</button>
						<button onClick={() => handleRemoveRepository(repository.id)}>
							Remover
						</button>
					</li>
				))}
			</ul>

			<form>
				<input
					type="text"
					name="title"
					id="title"
					placeholder="Nome do Repositrio"
					onChange={handleInputChange}
				/>
				<input
					type="text"
					name="url"
					id="url"
					placeholder="Url do Repositório"
					onChange={handleInputChange}
				/>
				<input
					type="text"
					name="techs"
					id="techs"
					placeholder="Tecnologias (separar por vírgulas)"
					onChange={handleInputChange}
				/>

				<button type="submit" onClick={handleAddRepository}>
					Adicionar
				</button>
			</form>
		</>
	);
}

export default App;
