<!-- DAFTAR -->
<div class="container">
            <br>
            <br><br><br><br><br>
            <h1 class="text-center" style="color: white;">Register Barista class</h1> <br>
            <div class="panel panel-default">
                <div class="panel-body">
                <form action="<?= BASEURL; ?>/daftar/tambah" method="POST" >
                    <div class="form-group">
                        <label for="email">Email</label>
                        <input type="text" name="email" id="email" class="form-control" required/>
                    </div>
                    <div class="form-group">
                        <label for="nama">Nama</label>
                        <input type="text" name="nama" id="nama" class="form-control" required/>
                    </div>
                    <div class="form-group">
                        <label for="noHP">Nomor HP</label>
                        <input type="text" name="noHP" id="noHP" class="form-control" required/>
                    </div>
                    <div class="form-group">
                        <label for="cv">Link Curiculum Vite (PNG)</label>
                        <input type="text" class="form-control" id="cv" name="cv" required/>
                    </div><br>
                    <div class="form-group">
                        <input type="submit" name="daftar" id="daftar" class="btn btn-info btn-block" value="Daftar" onclick="return confirm('Yakin?')"/>
                    </div>
                </form>
            </div>
</div>
</div>