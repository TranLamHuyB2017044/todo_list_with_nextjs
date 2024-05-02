import { useEffect, useRef, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import EditNoteIcon from "@mui/icons-material/EditNote";
import MyAlert from "../components/AlertComponents/Alert";
import Link from "next/link";
export default function Page() {
	const [products, setProducts] = useState<any>([]);
	const [nameError, setNameError] = useState<boolean>(false);
	const [priceError, setPriceError] = useState<boolean>(false);
	let NameRef: { current: any } = useRef();
	let PriceRef: { current: any } = useRef();

	const columns: any[] = [
		{
			field: "id",
			headerName: "ProductId",
			width: 150,
			renderCell: (row: { id: number; name: string; price: number }) => row.id,
		},
		{
			field: "name",
			headerName: "Product Name",
			width: 250,
			renderCell: (row: { id: number; name: string; price: number }) =>
				row.name,
		},
		{
			field: "price",
			headerName: "Price (vnd)",
			width: 150,
			renderCell: (row: { id: number; name: string; price: number }) =>
				row.price,
		},
		{
			field: "delete",
			headerName: "Delete",
			width: 100,
			renderCell: (row: { id: number; name: string; price: number }) => (
				<button
					onClick={() => deleteProduct(row.id)}
					className=" text-red-500 ml-4 text-2xl"
				>
					&times;
				</button>
			),
		},
		{
			field: "edit",
			headerName: "Edit",
			width: 100,
			renderCell: (row: { id: number; name: string; price: number }) => (
				<Link
					href={`/edit/${row.id}`}
					className="text-[dodgerblue] cursor-pointer"
				>
					<EditNoteIcon front-size="large" />
				</Link>
			),
		},
	];

	useEffect(() => {
		const data: string | null = window.localStorage.getItem("ProductList");
		if (data != null) {
			const Items: [] = JSON.parse(data);
			setProducts(Items);
		}
	}, []);

	const addProduct = (e: any) => {
		e.preventDefault();
		const product_name: string = NameRef.current.value;
		const product_price: number = PriceRef.current.value;
		if (product_name == "" && product_price != 0) {
			setNameError(true);
			setPriceError(false);
			return false;
		} else if (product_price == 0 && product_name != "") {
			setPriceError(true);
			setNameError(false);
			return false;
		} else if (product_price == 0 && product_name == "") {
			setPriceError(true);
			setNameError(true);
			return false;
		} else {
			const id: number = Math.floor(Math.random() * 10000);
			const item: { id: number; name: string; price: number } = {
				id: id,
				name: product_name,
				price: product_price,
			};
			setProducts((prev: any) => [item, ...prev]);
			window.localStorage.setItem(
				"ProductList",
				JSON.stringify([item, ...products])
			);
			NameRef.current.value = "";
			PriceRef.current.value = "";
			setNameError(false);
			setPriceError(false);
		}
	};

	const deleteProduct = (index: number): void => {
		const productList: any[] = [...products];
		MyAlert.Confirm(
			"Delete this product ?",
			"warning",
			`Are you sure to delete this product`,
			"Yes"
		).then(async (result) => {
			if (result.value) {
				productList.map(
					(product: { id: number; name: string; price: number }) => {
						if (index === product.id) {
							const newProduct = productList.filter(
								(product: { id: number; name: string; price: number }) =>
									product.id !== index
							);
							window.localStorage.setItem(
								"ProductList",
								JSON.stringify(newProduct)
							);
							setProducts(newProduct);
						}
					}
				);
			}
		});
	};
	return (
		<main className="relative ">
			<h1 className="text-5xl my-5 text-center ">TODO LIST WITH NEXT JS</h1>
			<form className="todo-list flex flex-col justify-center items-center gap-4 ">
				<h2 className="md:text-2xl lg:text-md">Type input below to add product</h2>
				<div className="flex flex-col gap-4 mt-5">
					<div className="form-group flex gap-4">
						<label htmlFor="name" className="min-w-[150px] md:text-2xl lg:text-lg">
							Product name
						</label>
						<input
							required={true}
							ref={NameRef}
							type="text"
							id="name"
							className="border-[1px] border-[dodgerblue] w-[200px] h-[40px] pl-2"
						/>
					</div>
					{nameError && (
						<p className="text-red-500 flex justify-end -mt-3 mr-8">
							Name can not be empty
						</p>
					)}
					<div className="form-group flex gap-4">
						<label htmlFor="price" className="min-w-[150px] md:text-2xl lg:text-lg">
							Price
						</label>
						<input
							required={true}
							ref={PriceRef}
							type="number"
							id="price"
							className="border-[1px] border-[dodgerblue] w-[200px] h-[40px] pl-2"
						/>
					</div>
					{priceError && (
						<p className="text-red-500 flex justify-end -mt-3 mr-8">
							Price can not be empty
						</p>
					)}
					<button
						type="submit"
						onClick={addProduct}
						className="w-[200px] active:translate-y-1 hover:bg-gradient-to-r from-blue-500 to-cyan-400 px-4 py-2 rounded-md 
						border border-white bg-[dodgerblue] text-white ml-auto"
					>
						Add product
					</button>
				</div>
			</form>
			<section className="flex justify-center md:mt-20 lg:mt-5 md:ml-16 mb-10">
				<Box sx={{ height: 330, width: "52%" }} className="md:w-fit md:px-8 ">
					<DataGrid
						rows={products}
						columns={columns}
						initialState={{
							pagination: {
								paginationModel: {
									pageSize: 5,
								},
							},
						}}
						pageSizeOptions={[5]}
						disableRowSelectionOnClick
					/>
				</Box>
			</section>
		</main>
	);
}
