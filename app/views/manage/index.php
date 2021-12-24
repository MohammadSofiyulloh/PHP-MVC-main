<br><br><br>
<div class="container">
<a href="<?= BASEURL; ?>/manage/logout"><input type="submit" name="logout" id="logout" class="btn btn-warning" value="Logout"/></a></li>
<h1 class="text-center" style="color: white;">Manajemen Data</h1><br>
<table class="table" style="color: white;">
  <thead class="thead-dark">
    <tr>
      <th scope="col">No</th>
      <th scope="col">Identitas Pendaftar</th>
    </tr>
  </thead>
  <tbody>
  <?php $count = 1; ?>
  <?php foreach($data['pendaftar'] as $prs):?>
    <tr>
      <th scope="row"><?= $count; ?></th>
      <td>
        <ul class="list-group" style="color: black;">
            <li class="list-group-item active"><?= $prs['nama'];?></li>
            <li class="list-group-item"><?= $prs['email'];?></li>
            <li class="list-group-item"><?= $prs['noHP'];?></li>
            <li class="list-group-item"><a href="<?= $prs['cv'];?>">Link cv</a></li>
            <li class="list-group-item"><a href="<?= BASEURL; ?>/manage/acc/<?= $prs['daftarID'];?>"><input type="submit" name="terima" id="terima" class="btn btn-info btn-block" value="Terima"/></a></li>
            <li class="list-group-item"><a href="<?= BASEURL; ?>/manage/drop/<?= $prs['daftarID'];?>" onclick="return confirm('Apakah anda yakin akan menolak pendaftar tersebut?');" class="btn btn-danger btn-block">Tolak</a></li>
        </ul>
      </td>
    </tr>
    <?php $count += 1; ?>
    <?php endforeach;?>
  </tbody>
</table>
</div>
