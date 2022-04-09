
export const MODE = "development";
const productionApi = "https://elibrary.persianstudio.ir/api";

export const API = (MODE === "production" ? productionApi : "http://localhost/elibrary/public/api");

export const BookActions = {
	ADD_FAVORITE: 1,
	REMOVE_FAVORITE: 2,
	DOWNLOAD: 3,
	DETAILS: 4
};
