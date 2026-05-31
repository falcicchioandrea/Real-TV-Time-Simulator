export const handleToggleFavorite = async () => {
    try{
        const res = await fetch("/favorite-api/favouriteToggle", {method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ movieId: Number(id) })})
            
            if(res.status==401){
                alert("Devi accedere per aggiungere il film ai preferiti")
            }else if(res.status == 200){ 
                const data= await res.json()
                setisFavorite(data.favoriteMovies.includes(Number(id)));
            }else{
                alert("Errore del Server ricarica la pagina")
            }
    }catch (error){
        console.error(error)
    }
}