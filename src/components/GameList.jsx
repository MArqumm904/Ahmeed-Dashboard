import { useState, useEffect } from "react";
import {
  Filter,
  Plus,
  X,
  Edit2,
  Trash2,
  ImageIcon,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { apiUrl } from "../config/config";
import Loader from "../Loader/Loader";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";

const GamesList = ({
  toggleEditMode,
  toggleCreateForm,
  showCreateForm,
  isEditMode,
  refreshTrigger,
}) => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [gameToDelete, setGameToDelete] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [gameTypes, setGameTypes] = useState([
    { id: 1, type_name: "matchingtype" },
    { id: 2, type_name: "selectiontype" },
    { id: 3, type_name: "draggingtype" },
    { id: 4, type_name: "TypingPairs" },
  ]);

  const [filters, setFilters] = useState({
    searchTerm: "",
    questionCount: { min: "", max: "" },
    status: "",
    game_type: "",
  });

  useEffect(() => {
    fetchGames();
  }, [filters, refreshTrigger]);

  const fetchGames = async () => {
    setLoading(true);
    setError(null);

    try {
      // Prepare API parameters based on filters
      const params = {
        uniqueKey: "englearning1234",
      };

      const response = await axios.get(`${apiUrl}/get_games.php`, {
        headers: {
          "Content-Type": "application/json",
        },
        params: params,
      });

      const data = response.data;
      console.log("RAW API RESPONSE:", data); 

      if (data.success) {
        const processedGames = data.games.map(game => ({
    ...game,
    questions: game.questions?.flat() || [] 
  }));
  setGames(processedGames);
      } else {
        throw new Error(data.message || "Error fetching games");
      }
    } catch (err) {
      console.error("Error fetching games:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field, value, subField = null) => {
    setFilters((prev) => {
      if (subField) {
        return {
          ...prev,
          [field]: {
            ...prev[field],
            [subField]: value,
          },
        };
      }
      return {
        ...prev,
        [field]: value,
      };
    });
  };

  const confirmDelete = (gameId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#7e22ce", // blue
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        // Pass the gameId directly to handleDelete instead of setting state
        handleDelete(gameId);
      }
    });
  };

  const handleDelete = async (gameId) => {
    setLoading(true);

    try {
      const response = await axios.post(`${apiUrl}/delete_games.php`, {
        uniqueKey: "englearning1234",
        game_id: gameId,
      });

      const data = response.data;

      if (
        response.status === 200 &&
        data.message === "Game moved to trash successfully"
      ) {
        toast.success("Game deleted successfully 🎉");

        setGames(games.filter((game) => game.id !== gameId));
      } else {
        const msg = data.message || data.error || "Failed to delete game";
        toast.error(`Error: ${msg}`);
      }
    } catch (err) {
      console.error("Error deleting game:", err);

      if (err.response && err.response.data?.errors) {
        // Show validation errors
        const errors = err.response.data.errors;
        Object.values(errors).forEach((msg) => toast.error(msg));
      } else {
        toast.error(err.message || "Unexpected error");
      }
    } finally {
      setLoading(false);
    }
  };

  // Format game type for display
  const formatGameType = (type) => {
    switch (type) {
      case "matchingtype":
        return "Matching";
      case "selectiontype":
        return "Selection";
      case "draggingtype":
        return "Dragging";
      case "TypingPairs":
        return "Typing Pairs"; 
      default:
        return type;
    }
  };

  // Format date for better display
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Your Games</h2>

      <div className="mb-6">
        <div className="flex justify-between items-center">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center text-blue-500 hover:text-blue-700"
          >
            <Filter size={16} className="mr-1" />
            {showFilters ? "Hide Filters" : "Advanced Filters"}
          </button>

          {filters.searchTerm ||
          filters.status ||
          filters.questionCount.min ||
          filters.questionCount.max ||
          filters.game_type ? (
            <button
              onClick={() =>
                setFilters({
                  searchTerm: "",
                  questionCount: { min: "", max: "" },
                  status: "",
                  game_type: "",
                })
              }
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Clear All Filters
            </button>
          ) : null}
        </div>

        {showFilters && (
          <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg animate-slideDown">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Search by Title
                </label>
                <input
                  type="text"
                  value={filters.searchTerm}
                  onChange={(e) =>
                    handleFilterChange("searchTerm", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Search games..."
                />
              </div>

              {/* Question count filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Number of Items
                </label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    min="0"
                    value={filters.questionCount.min}
                    onChange={(e) =>
                      handleFilterChange("questionCount", e.target.value, "min")
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Min"
                  />
                  <span className="self-center">to</span>
                  <input
                    type="number"
                    min="0"
                    value={filters.questionCount.max}
                    onChange={(e) =>
                      handleFilterChange("questionCount", e.target.value, "max")
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Max"
                  />
                </div>
              </div>

              {/* Status filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Game Status
                </label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange("status", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              {/* Game type filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Game Type
                </label>
                <select
                  name="game_type"
                  value={filters.game_type}
                  onChange={(e) =>
                    handleFilterChange("game_type", e.target.value)
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Types</option>
                  {gameTypes.map((type) => (
                    <option key={type.id} value={type.type_name}>
                      {formatGameType(type.type_name)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {loading && games.length === 0 ? (
        <div className="flex justify-center py-12">
          <Loader />
        </div>
      ) : games.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <ImageIcon size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No games yet</h3>
          <p className="mt-1 text-gray-500">
            Get started by creating your first game.
          </p>
          <div className="mt-4">
            <button
              onClick={toggleCreateForm}
              className="flex items-center px-6 py-3 mx-auto bg-blue-600  hover:bg-blue-700  text-white rounded-lg font-medium shadow-md transition-all duration-300"
            >
              {showCreateForm ? (
                <>
                  <X size={18} className="mr-2" />
                  {isEditMode ? "Cancel Edit" : "Cancel"}
                </>
              ) : (
                <>
                  <Plus size={18} className="mr-2" />
                  Create Game
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game) => (
            <div
              key={game.id}
              className="bg-white rounded-xl overflow-hidden shadow-md border border-gray-200 transition-all duration-300 hover:shadow-lg"
            >
              <div className="relative h-48">
                <img
                  src={`${apiUrl}/${game.game_icon}`}
                  alt={game.title}
                  className="w-full h-full object-cover py-4 px-2"
                />
                <div className="absolute top-0 right-0 p-2 flex space-x-2">
                  <button
                    className="p-1.5 bg-white rounded-full shadow-md text-blue-500 hover:text-blue-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log("Game data being passed to edit:", games.find(g => g.id === game.id)); // Debug log
                      toggleEditMode(games.find(g => g.id === game.id)); // Pass the entire game object
                      setTimeout(() => {
                        document
                          .getElementById("EDIT")
                          ?.scrollIntoView({ behavior: "smooth" });
                      }, 100);
                    }}
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => confirmDelete(game.id)}
                    className="p-1.5 bg-white rounded-full shadow-md text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="p-5">
                <h3 className="font-semibold text-lg text-gray-800 mb-2">
                  {game.title}
                </h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {game.description}
                </p>

                <div className="flex justify-between items-center">
                  <div className="flex items-center flex-wrap gap-2">
                    <span className="text-xs text-blue-500 font-medium bg-blue-50 px-2 py-0.5 rounded">
                      {game.itemCount} Item{game.itemCount !== 1 ? "s" : ""}
                    </span>
                    <span className="text-xs text-blue-500 font-medium bg-blue-50 px-2 py-0.5 rounded">
                      {formatGameType(game.game_type)}
                    </span>
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded 
                        ${
                          game.status === "active"
                            ? "text-green-600 bg-green-100"
                            : "text-red-600 bg-red-100"
                        }`}
                    >
                      {game.status}
                    </span>
                  </div>
                  <div className="flex space-x-1">
                    {game.additionalImages.slice(0, 2).map((img, idx) => (
                      <div
                        key={idx}
                        className="w-6 h-6 rounded-full overflow-hidden border border-gray-200"
                      >
                        <img
                          src={`${apiUrl}/${img}`}
                          alt="Additional"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                    {game.additionalImages.length > 2 && (
                      <div className="w-6 h-6 rounded-full bg-gray-100 text-xs flex items-center justify-center text-gray-500">
                        +{game.additionalImages.length - 2}
                      </div>
                    )}
                  </div>
                </div>
                <div className="mt-3 text-xs text-gray-500">
                  Created: {formatDate(game.created_at)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default GamesList;
