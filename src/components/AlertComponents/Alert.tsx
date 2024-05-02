import Swal, { SweetAlertResult } from "sweetalert2";

class MyAlert {
	Toast(icon: string, title: string): void {
		Swal.fire({
			toast: true,
			position: "top-end",
			icon: icon as any,
			title: title,
			showConfirmButton: false,
			padding: 15,
			timer: 3000,
			timerProgressBar: true,
		});
	}

	async Confirm(
		title: string,
		icon: string,
		text: string,
		confirmButtonText: string,
		
	): Promise<SweetAlertResult & { isDismissed: boolean }> {
		return Swal.fire({
			title: title,
			text: text,
			icon: icon as any,
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: confirmButtonText,
			width: 500,
		}).then((result: SweetAlertResult) => {
			return result as SweetAlertResult & { isDismissed: boolean };
		});
	}
}

export default new MyAlert();
