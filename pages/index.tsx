import { useEffect, useRef, useState } from "react";
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import EditNoteIcon from '@mui/icons-material/EditNote';
import Link from 'next/link'
import MyAlert from '../src/components/AlertComponents/Alert'
export default function Page() {
	const [products, setProducts] = useState<any>([]);
	const [nameError, setNameError] = useState(false)
	const [priceError, setPriceError] = useState(false)
	let NameRef: any = useRef();
	let PriceRef: any = useRef();

	
	const columns: GridColDef<(typeof products)[number]>[] = [
		{ field: 'id', headerName: 'ProductId', width: 150, renderCell: (row: any) => row.id },
		{ field: 'name', headerName: 'Product Name', width: 250, renderCell: (row: any) => row.name },
		{ field: 'price', headerName: 'Price (vnd)', width: 150, renderCell: (row: any) => row.price },
		{
			field: 'delete', headerName: 'Delete', width: 100, renderCell: (row: any) => (<button
				onClick={() => deleteProduct(row.id)}
				className=" text-red-500 ml-4 text-2xl"
			>
				&times;
			</button>)
		},
		{ 
			field: 'edit', headerName: 'Edit', width: 100, renderCell: (row: any) => (<Link href={`/edit/${row.id}`} 
				className="text-[dodgerblue] cursor-pointer">
					<EditNoteIcon front-size='large' />
			</Link>)},

	];

	useEffect(() => {
		const data = window.localStorage.getItem('ProductList')
		if (data != null) {
			const Items = JSON.parse(data);
			setProducts(Items)
		}

	}, [])



	const addProduct = (e: any) => {
		e.preventDefault();
		const product_name = NameRef.current.value;
		const product_price = PriceRef.current.value;
		if (product_name == '' && product_price != '') {
			setNameError(true)
			setPriceError(false)
			return false
		} else if (product_price == '' && product_name != '') {
			setPriceError(true)
			setNameError(false)
			return false
		} else if (product_price == '' && product_name == '') {
			setPriceError(true)
			setNameError(true)
			return false
		} else {
			const id = Math.floor(Math.random() * 10000);
			const item = { id: id, name: product_name, price: parseInt(product_price) }
			setProducts((prev: any) => [
				item,
				...prev,
			]);
			window.localStorage.setItem('ProductList', JSON.stringify([item, ...products]))
			NameRef.current.value = "";
			PriceRef.current.value = "";
			setNameError(false)
			setPriceError(false)
		}
	};


	const deleteProduct = (index: number) => {
		const productList = [...products];
		MyAlert.Confirm('Delete this product ?', 'warning', `Are you sure to delete this product`, 'Yes')
		.then(async (result) => {
			if (result.value) {
				productList.map((product: any) => {
					if (index === product.id) {
						const newProduct = productList.filter(
							(product: any) => product.id !== index
						);
						window.localStorage.setItem('ProductList', JSON.stringify(newProduct))
						setProducts(newProduct);
					}
				});
			}
		})
		
	};

	return (
		<main className="relative">


			<h1 className="text-5xl my-5 text-center">TODO LIST WITH NEXT JS</h1>
			<form className="todo-list flex flex-col justify-center items-center gap-4 ">
				<h2>Type input below to add product</h2>
				<div className="flex flex-col gap-4 mt-5">
					<div className="form-group flex gap-4">
						<label htmlFor="name" className="min-w-[150px]">
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
					{nameError && <p className="text-red-500 flex justify-end -mt-3 mr-8">Name can not be empty</p>}
					<div className="form-group flex gap-4">
						<label htmlFor="price" className="min-w-[150px]">
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
					{priceError && <p className="text-red-500 flex justify-end -mt-3 mr-8">Price can not be empty</p>}
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
			<section className="flex justify-center mt-5">
				<Box sx={{ height: 330, width: '52%' }}>
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
