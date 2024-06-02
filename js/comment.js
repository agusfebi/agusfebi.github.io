import { card } from './card.js';
import { util } from './util.js';
import { theme } from './theme.js';
import { storage } from './storage.js';
import { pagination } from './pagination.js';
// import json


export const comment = (() => {

    const owns = storage('owns');
    const session = storage('session');
    let commentsData = []; // Data dari file JSON

    // Fungsi untuk membaca data dari file JSON
    const fetchDataFromJSON = async () => {
        try {
            const response = await fetch('./assets/comment.json'); // Ganti dengan path file JSON Anda
            if (!response.ok) {
                throw new Error('Failed to fetch comments data');
            }
            commentsData = await response.json();
        } catch (error) {
            console.error('Error fetching comments data:', error);
        }
    };

    // Fungsi untuk menyimpan data ke file JSON
    const saveDataToJSON = async () => {
        try {
            const response = await fetch('./assets/comment.json', {
                method: 'PUT', // Misalnya Anda ingin mengganti seluruh data dengan data yang baru
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(commentsData)
            });
            if (!response.ok) {
                throw new Error('Failed to save comments data');
            }
        } catch (error) {
            console.error('Error saving comments data:', error);
        }
    };

    const remove = async (button) => {
        if (!confirm('Are you sure?')) {
            return;
        }

        const id = button.getAttribute('data-uuid');

        // Hapus data dari array commentsData
        commentsData = commentsData.filter(comment => comment.id !== id);

        // Simpan perubahan ke file JSON
        await saveDataToJSON();

        // Lanjutkan dengan kode penghapusan elemen HTML
    };

    const changeButton = (id, disabled) => {
        const buttonMethod = ['reply', 'edit', 'remove'];

        buttonMethod.forEach((v) => {
            const status = document.querySelector(`[onclick="comment.${v}(this)"][data-uuid="${id}"]`);
            if (status) {
                status.disabled = disabled;
            }
        });
    };

    const comment = async () => {
        // Fungsi ini digunakan untuk memuat ulang komentar dari file JSON
        card.renderLoading();

        // Memuat data komentar dari file JSON
        await fetchDataFromJSON();

        // Render komentar sesuai dengan data yang ada di commentsData
        // Anda perlu mengubah kode ini agar sesuai dengan struktur data komentar dan tampilan yang Anda inginkan
        const comments = document.getElementById('comments');
        if (commentsData.length === 0) {
            comments.innerHTML = `<div class="h6 text-center fw-bold p-4 my-3 bg-theme-${theme.isDarkMode('dark', 'light')} rounded-4 shadow">Yuk bagikan undangan ini biar banyak komentarnya</div>`;
        } else {
            comments.innerHTML = commentsData.map(comment => card.renderContent(comment)).join('');
            commentsData.forEach(c => card.fetchTracker(c));
        }
    };

    // Fungsi untuk menambah komentar baru
    const send = async (newComment) => {
        try {
            // Assign id unik ke komentar baru (misalnya menggunakan timestamp)
            newComment.id = Date.now().toString();
            // Tambahkan komentar baru ke array commentsData
            commentsData.push(newComment);
            // Simpan perubahan ke file JSON
            await saveDataToJSON();
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    // Fungsi untuk mengubah komentar
    const edit = async (updatedComment) => {
        try {
            // Cari indeks komentar yang akan diubah dalam array commentsData
            const index = commentsData.findIndex(comment => comment.id === updatedComment.id);
            // Perbarui komentar dengan yang baru
            commentsData[index] = updatedComment;
            // Simpan perubahan ke file JSON
            await saveDataToJSON();
        } catch (error) {
            console.error('Error updating comment:', error);
        }
    };

    // Fungsi untuk menghapus komentar
    const deleteComment = async (commentId) => {
        try {
            // Filter komentar yang tidak sesuai dengan id yang diberikan
            commentsData = commentsData.filter(comment => comment.id !== commentId);
            // Simpan perubahan ke file JSON
            await saveDataToJSON();
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    };

    return {
    
        send,
        edit,
      
        remove,
       
        comment,
        renderLoading: card.renderLoading,
      
        deleteComment
    }
})();
